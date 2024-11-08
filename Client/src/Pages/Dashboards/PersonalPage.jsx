import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProfileByUserId } from "../../Redux/Home/Profile_apiRequest";
import {
  CalendarDateRangeIcon,
  HomeIcon,
  UserCircleIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import CommentSection from "../../Components/Layout/CommentSection";

export default function PersonalPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState([]);
  const [postData, setPostData] = useState([]);
  const { currentUser, accessToken } = useSelector((state) => state.auth.login);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProfileByUserId(accessToken, id);
      setUserData(data);
    };

    const fetchPost = async () => {
      const url = `/api/post/getPostWithCommentsByUserId?userId=${id}`;
      const response = await fetch(url);
      const data = await response.json();
      setPostData(data);
    };
    fetchData();
    fetchPost();
  }, [accessToken, id]);

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
            <p className="text-gray-400">360 người bạn</p>
            <div className="mt-3 flex justify-center">
              {/* Friend's Avatars */}
              <div className="flex space-x-2">
                <img
                  src="https://via.placeholder.com/40"
                  alt="Friend 1"
                  className="h-8 w-8 rounded-full"
                />
                <img
                  src="https://via.placeholder.com/40"
                  alt="Friend 2"
                  className="h-8 w-8 rounded-full"
                />
                <img
                  src="https://via.placeholder.com/40"
                  alt="Friend 3"
                  className="h-8 w-8 rounded-full"
                />
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
                <button className="rounded bg-blue-500 px-4 py-2 shadow hover:bg-blue-600">
                  Theo dõi
                </button>
                <button className="rounded bg-gray-700 px-4 py-2 shadow hover:bg-gray-600">
                  Nhắn tin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="mt-6 border-t border-gray-700">
        <div className="flex justify-center space-x-6 text-gray-300">
          <button className="hover:text-blue-500">Bài viết</button>
          <button className="hover:text-blue-500">Giới thiệu</button>
          <button className="hover:text-blue-500">Bạn bè</button>
          <button className="hover:text-blue-500">Ảnh</button>
          <button className="hover:text-blue-500">Video</button>
          <button className="hover:text-blue-500">Check in</button>
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
            <a
              href="/dashboard?tab=profile"
              className="mt-2 block w-full rounded bg-gray-700 py-2 text-center shadow hover:bg-gray-600"
            >
              Chỉnh sửa chi tiết
            </a>
          </div>
        </div>

        <div className="flex-1 rounded bg-gray-800 p-4 shadow">
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
      </div>
    </div>
  );
}
