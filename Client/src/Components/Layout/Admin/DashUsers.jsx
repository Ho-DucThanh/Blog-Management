import { useSelector } from "react-redux";
import { getAllProfiles } from "../../../Redux/Home/Profile_apiRequest";
import { useEffect, useState } from "react";
import { deleteUser } from "../../../Redux/Auth/Auth_apiRequest";

export default function Users() {
  const [error, setError] = useState("");

  const { currentUser, accessToken } = useSelector((state) => state.auth.login);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profileData = await getAllProfiles(accessToken, setError);
        setProfiles(profileData);
        console.log(profileData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProfiles();
  }, [accessToken]);

  const handleDeleteUser = async (userId) => {
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa người dùng này không?`,
    );
    if (isConfirmed) {
      try {
        await deleteUser(accessToken, userId);
        setProfiles(profiles.filter((profile) => profile.user_id !== userId));
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
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Username
            </th>
            <th scope="col" className="px-6 py-3">
              Sex
            </th>
            <th scope="col" className="px-6 py-3">
              Phone
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {currentUser.admin && profiles.length > 0 ? (
            profiles.map((profile) => (
              <tr
                key={profile.user_id}
                className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
              >
                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {profile.email}
                </td>

                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {profile.userName}
                </td>

                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {profile.sex}
                </td>

                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {profile.phone}
                </td>

                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-red-600 hover:underline dark:text-red-500"
                    onClick={() => handleDeleteUser(profile.user_id)}
                  >
                    Delete
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
