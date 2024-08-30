import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllPost } from "../../Redux/Post/Post_apiRequest";

export default function Course() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { currentUser, accessToken } = useSelector((state) => state.auth.login);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getAllPost(accessToken);
        setData(posts);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPosts();
  }, [accessToken]);
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-16 py-3">
              <span className="sr-only">Image</span>
            </th>
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
          {currentUser.admin && data.length > 0 ? (
            data.map((post) => (
              <tr
                key={post._id}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                <td className="p-4">
                  <img
                    src={post.image}
                    className="max-h-full w-16 max-w-full md:w-32"
                    alt=""
                  />
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {post.title}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  {post.category}
                </td>
                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-green-600 hover:underline dark:text-green-500"
                  >
                    Edit
                  </a>
                </td>
                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-red-600 hover:underline dark:text-red-500"
                  >
                    Remove
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
