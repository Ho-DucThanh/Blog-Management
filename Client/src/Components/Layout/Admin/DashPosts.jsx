import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { getAllPost, deletePost } from "../../../Redux/Post/Post_apiRequest";
import { getAllProfiles } from "../../../Redux/Home/Profile_apiRequest";

export default function Posts() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const { currentUser, accessToken } = useSelector((state) => state.auth.login);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let posts;
        if (currentUser.admin) {
          posts = await getAllPost(accessToken);
        } else {
          const response = await fetch(
            `http://localhost:3000/api/post/getPost?userId=${currentUser._id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          posts = await response.json();
        }

        setData(posts.posts || posts);
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

    fetchPosts();
    fetchProfiles();
  }, [accessToken, currentUser]);

  const getUsernameForPost = (post) => {
    const matchingProfile = profiles.find(
      (profile) => profile.user_id === post.user_id,
    );
    return matchingProfile ? matchingProfile.userName : "Unknown User";
  };

  const handleDeletePost = async (postId, userId) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa bài viết này không?`,
    );
    if (isConfirmed) {
      try {
        await deletePost(postId, userId, accessToken);
        setData(data.filter((post) => post._id !== postId));
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
            <th scope="col" className="px-16 py-3">
              <span className="sr-only">Image</span>
            </th>
            {currentUser.admin && (
              <th scope="col" className="px-6 py-3">
                User Name
              </th>
            )}
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Category
            </th>
            <th scope="col" className="px-6 py-3">
              Edit
            </th>
            <th scope="col" className="px-6 py-3">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {currentUser && data.length > 0 ? (
            data.map((post) => (
              <tr
                key={post._id}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                <td className="p-4">
                  <img
                    src={post.image}
                    className="max-h-full w-16 max-w-full object-cover md:w-32"
                    alt=""
                  />
                </td>
                {currentUser.admin && (
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {getUsernameForPost(post)}
                  </td>
                )}
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {post.title}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {post.category}
                </td>
                <td className="px-6 py-4">
                  <a
                    href={`/update-post/${post._id}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Edit
                  </a>
                </td>
                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-red-600 hover:underline dark:text-red-500"
                    onClick={() => handleDeletePost(post._id, post.user_id)}
                  >
                    Remove
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center">
                No posts found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Link
        to="/create-post"
        className="fixed bottom-10 right-10 flex items-center justify-center rounded-full bg-gray-800 p-4 text-white shadow-lg transition-all duration-300 hover:bg-blue-600"
        title="Add Post"
      >
        <IoMdAdd className="text-2xl" />
      </Link>
    </div>
  );
}
