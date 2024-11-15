import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProfileByUserId } from "../../Redux/Home/Profile_apiRequest";
import {
  CalendarDateRangeIcon,
  HomeIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import CommentSection from "../../Components/Layout/CommentSection";
import {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFriends,
} from "../../Redux/Page/Follow_Api";

export default function PersonalPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState([]);
  const [postData, setPostData] = useState([]);
  const { currentUser, accessToken } = useSelector((state) => state.auth.login);
  const [isFollowing, setIsFollowing] = useState(false); // State to track follow status
  const [showConfirm, setShowConfirm] = useState(false); // State to show confirmation dialog
  const [activeTab, setActiveTab] = useState("posts");

  const [followingData, setFollowingData] = useState([]);
  const [followersData, setFollowersData] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getProfileByUserId(accessToken, id);
      setUserData(data);
    };

    // Fetch post
    const fetchPost = async () => {
      const url = `/api/post/getPostWithCommentsByUserId?userId=${id}`;
      const response = await fetch(url);
      const data = await response.json();
      setPostData(data);
    };
    fetchData();
    fetchPost();
  }, [accessToken, id]);

  useEffect(() => {
    // Check following
    const checkFollowing = async () => {
      const followingResponse = await fetch(
        `/api/follow/check-following?userId=${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const followingData = await followingResponse.json();
      setIsFollowing(followingData.isFollowing); // Cập nhật trạng thái theo dõi
    };
    checkFollowing();

    // Fetch following
    const fetchFollowing = async () => {
      const followingResponse = await getFollowing(id);
      setFollowingData(followingResponse);
    };
    fetchFollowing();

    // Fetch followers
    const fetchFollowers = async () => {
      const followersResponse = await getFollowers(id);
      setFollowersData(followersResponse);
    };
    fetchFollowers();

    // Fetch friends
    const fetchFriends = async () => {
      const friendsResponse = await getFriends(id);
      setFriendsData(friendsResponse);
    };
    fetchFriends();
  }, [accessToken, id]);

  const handleFollow = async () => {
    if (isFollowing) {
      setShowConfirm(true); // Show confirmation dialog if already following
    } else {
      try {
        await followUser(accessToken, currentUser._id, id);
        setIsFollowing(true); // Update follow status
      } catch (error) {
        console.error("Error following user:", error.message);
        // Optionally, show an error message to the user
      }
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(accessToken, currentUser._id, id);
      setIsFollowing(false); // Update follow status
      setShowConfirm(false); // Close confirmation dialog
    } catch (error) {
      console.error("Error unfollowing user:", error.message);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Cover Photo */}
      <div className="relative h-20 w-full bg-gray-900"></div>

      {/* Profile Section */}
      <div className="px-6 py-4">
        <div className="relative flex flex-col items-center">
          <div className="absolute -top-20">
            <img
              className="h-40 w-40 rounded-full border-4 border-gray-900 object-cover shadow-lg"
              src={userData.avatar}
              alt="Profile Avatar"
            />
          </div>
          <div className="mt-20 text-center">
            <h1 className="text-3xl font-bold">{userData.userName}</h1>
            <p className="text-gray-400">
              {friendsData.length > 0
                ? `${friendsData.length} người bạn`
                : "Chưa có người bạn nào"}
            </p>
            <div className="mt-3 flex justify-center">
              {/* Friend's Avatars */}
              <div className="flex space-x-2">
                {friendsData.map((friend) => (
                  <img
                    key={friend._id}
                    src={friend.avatar}
                    alt={friend.userName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ))}
              </div>
            </div>

            {id === currentUser._id ? (
              <div className="mt-4 flex space-x-4">
                <a
                  className="rounded bg-gray-700 px-4 py-2 shadow hover:bg-gray-600"
                  href="/dashboard?tab=profile"
                >
                  Chỉnh sửa trang cá nhân
                </a>
              </div>
            ) : (
              <div className="mt-4 flex space-x-4">
                <button
                  className={`rounded px-4 py-2 shadow ${
                    isFollowing
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  onClick={handleFollow}
                >
                  {isFollowing ? "Đang theo dõi" : "Theo dõi"}
                </button>
                <button className="rounded bg-gray-700 px-4 py-2 shadow hover:bg-gray-600">
                  Nhắn tin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded bg-gray-800 p-6 shadow-lg">
            <h2 className="text-lg font-bold">
              Bạn có chắc chắn muốn bỏ theo dõi?
            </h2>
            <div className="mt-4 flex space-x-4">
              <button
                className="rounded bg-red-500 px-4 py-2 shadow hover:bg-red-600"
                onClick={handleUnfollow}
              >
                Bỏ theo dõi
              </button>
              <button
                className="rounded bg-gray-700 px-4 py-2 shadow hover:bg-gray-600"
                onClick={() => setShowConfirm(false)} // Close confirmation dialog
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu */}
      <div className="mt-6 border-t border-gray-700">
        <div className="flex justify-center space-x-6 text-gray-300">
          <button
            className="hover:text-blue-500"
            onClick={() => setActiveTab("posts")}
          >
            Bài viết
          </button>
          <button
            className="hover:text-blue-500"
            onClick={() => setActiveTab("following")}
          >
            Đang theo dõi
          </button>
          <button
            className="hover:text-blue-500"
            onClick={() => setActiveTab("followers")}
          >
            Người theo dõi
          </button>
          <button className="hover:text-blue-500">Xem thêm</button>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="mt-6 flex space-x-6 p-6">
        <div className="sticky top-20 h-4/5 w-1/3 rounded bg-gray-800 p-4 shadow">
          <h2 className="mb-4 text-xl font-semibold">Giới thiệu</h2>
          <div className="mt-4">
            <p className="flex items-center gap-4">
              <CalendarDateRangeIcon
                className="block h-8 w-8"
                aria-hidden="true"
              />
              <span className="font-bold">
                Birth Day{" "}
                {userData.date
                  ? format(new Date(userData.date), "dd/MM/yyyy")
                  : "N/A"}
              </span>
            </p>

            <p className="flex items-center gap-5">
              <HomeIcon className="block h-8 w-8" aria-hidden="true" />
              <span className="font-bold">{userData.address}</span>
            </p>
            {id === currentUser._id && (
              <a
                href="/dashboard?tab=profile"
                className="mt-2 block w-full rounded bg-gray-700 py-2 text-center shadow hover:bg-gray-600"
              >
                Chỉnh sửa chi tiết
              </a>
            )}
          </div>
        </div>

        {/* Post Section */}
        {activeTab === "posts" && (
          <div className="flex-1 rounded bg-gray-800 p-4 shadow">
            {/* Search Section */}
            <div className="mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết"
                  className="flex-1 rounded bg-gray-700 p-2 outline-none"
                />
              </div>
            </div>

            {/* Post Section */}
            <div className="mt-4">
              <h2 className="text-lg font-bold">
                {postData.totalPosts} Bài viết
              </h2>
              {postData.totalPosts > 0 ? (
                postData.postsWithComments.map((post) => (
                  <div
                    key={post._id}
                    className="mt-4 rounded bg-gray-900 p-4 shadow-md"
                  >
                    {/* Hiển thị tiêu đề bài viết */}
                    <h3 className="text-xl font-bold">{post.title}</h3>

                    {/* Hình ảnh */}
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post Image"
                        className="mt-2 w-full rounded-lg object-cover"
                        style={{ maxHeight: "400px" }}
                      />
                    )}

                    {/* Nội dung */}
                    <div
                      className="mt-2 text-gray-300"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Số lượng bình luận và lượt thích */}
                    <div className="mt-3 flex items-center space-x-6 text-gray-400">
                      <div className="flex items-center space-x-1">
                        <ChatBubbleOvalLeftIcon className="h-5 w-5" />
                        <span>{post.comments.length}</span>
                      </div>
                    </div>

                    {/* Comment Section */}
                    <div className="mt-4">
                      <CommentSection
                        postId={post._id}
                        comments={post.comments}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="mt-2 text-gray-400">Chưa có bài viết nào.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "following" && (
          <div className="flex-1 rounded bg-gray-800 p-4 shadow">
            <h2 className="mb-4 text-xl font-semibold">
              Đang theo dõi ({followingData.length}) người dùng
            </h2>
            {followingData.length > 0 ? (
              followingData.map((user) => (
                <div
                  key={user._id}
                  className="mb-4 flex w-1/2 justify-between rounded-lg p-3"
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={user.avatar}
                      alt={user.userName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="text-lg text-gray-300">
                      {user.userName}
                    </span>
                  </div>
                  <button
                    className="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
                    onClick={() => {
                      setShowConfirm(true); // Show confirmation dialog
                      setCurrentUserToUnfollow(user); // Set the user to unfollow
                    }}
                  >
                    Bỏ theo dõi
                  </button>
                </div>
              ))
            ) : (
              <p className="text-lg text-gray-400">Bạn chưa theo dõi ai.</p>
            )}
          </div>
        )}

        {activeTab === "followers" && (
          <div className="flex-1 rounded bg-gray-800 p-4 shadow">
            <h2 className="mb-4 text-xl font-semibold">
              Hiện tại có ({followersData.length}) người dùng theo dõi
            </h2>
            {followersData.length > 0 ? (
              followersData.map((user) => (
                <div
                  key={user._id}
                  className="mb-4 flex items-center space-x-2"
                >
                  <img
                    src={user.avatar}
                    alt={user.userName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <span className="text-lg text-gray-300">{user.userName}</span>
                </div>
              ))
            ) : (
              <p className="text-lg text-gray-400">Chưa có người theo dõi.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
