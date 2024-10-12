import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllProfiles } from "../../../Redux/Home/Profile_apiRequest";
import {
  getAllComments,
  deleteComment,
} from "../../../Redux/Comment/Comment_apiRequest";
import { getAllPost } from "../../../Redux/Post/Post_apiRequest";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

export default function Comments() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const { currentUser, accessToken } = useSelector((state) => state.auth.login);
  const [profiles, setProfiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Thêm trạng thái cho số trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang

  const limit = 12; // Số comment trên mỗi trang

  useEffect(() => {
    const fetchComments = async () => {
      try {
        let comments;
        const url = currentUser.admin
          ? `/api/comment/getComments?page=${currentPage}&limit=${limit}`
          : `/api/comment/getComments?userId=${currentUser._id}&page=${currentPage}&limit=${limit}`;

        const response = await fetch(url);
        const result = await response.json();
        comments = result.comments || result;
        setData(comments);
        setTotalPages(result.totalPages);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchPosts = async () => {
      try {
        let posts;

        if (currentUser.admin) {
          posts = await getAllPost(accessToken);
        } else {
          const response = await fetch(
            `/api/comment/getPostWithUserComment?userId=${currentUser._id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          posts = await response.json();
        }

        console.log("Fetched posts:", posts);
        setPosts(posts.posts || posts);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchProfiles = async () => {
      try {
        const profileData = await getAllProfiles(accessToken, setError);
        setProfiles(profileData);
        console.log(profileData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchComments();
    fetchPosts();
    fetchProfiles();
  }, [accessToken, currentUser]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getUsernameForComment = (comment) => {
    const matchingProfile = profiles.find(
      (profile) => profile.user_id === comment.user_id,
    );
    return matchingProfile ? matchingProfile.userName : "Admin";
  };

  const getPostTitleForComment = (comment) => {
    const matchingPost = posts.find((post) => post._id === comment.postId);
    return matchingPost ? matchingPost.title : "Post";
  };

  const handleDeleteComment = async (commentId) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa comment này không?`,
    );
    if (isConfirmed) {
      try {
        await deleteComment(accessToken, commentId);
        setData(data.filter((comment) => comment._id !== commentId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {currentUser.admin && (
              <th scope="col" className="px-6 py-3">
                User Name
              </th>
            )}
            <th scope="col" className="px-6 py-3">
              Post Title
            </th>
            <th scope="col" className="px-6 py-3">
              Comment
            </th>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {currentUser && data.length > 0 ? (
            data.map((comment) => (
              <tr
                key={comment._id}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                {currentUser.admin && (
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {getUsernameForComment(comment)}
                  </td>
                )}
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {getPostTitleForComment(comment)}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {comment.content}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-red-600 hover:underline dark:text-red-500"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    Remove
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center">
                No comments found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="my-6 flex flex-col items-center justify-end space-y-2 md:flex-row md:space-x-4 md:space-y-0">
        <button
          className="flex h-8 items-center justify-center rounded-xl bg-gray-800 px-3 text-sm font-medium text-white hover:bg-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <HiArrowLeft
            className="me-2 h-3.5 w-3.5 rtl:rotate-180"
            aria-hidden="true"
          />
          Prev
        </button>
        <span className="font-semibold text-gray-900">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="flex h-8 items-center justify-center rounded-xl border-s border-gray-700 bg-gray-800 px-3 text-sm font-medium text-white hover:bg-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <HiArrowRight
            className="ms-2 h-3.5 w-3.5 rtl:rotate-180"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
