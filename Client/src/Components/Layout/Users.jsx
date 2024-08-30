import { useDispatch, useSelector } from "react-redux";
import { getListUsers } from "../../Redux/Auth/Auth_apiRequest";
import { getAllProfiles } from "../../Redux/Home/Profile_apiRequest";
import { useEffect, useState } from "react";

export default function Users() {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { currentUser, accessToken } = useSelector((state) => state.auth.login);
  const [mergeData, setMergeData] = useState([]);

  useEffect(() => {
    const fetchUsersAndProfiles = async () => {
      try {
        const usersData = await getListUsers(accessToken);
        const profileData = await getAllProfiles(
          accessToken,
          dispatch,
          setError,
        );
        console.log(usersData);

        console.log(profileData);

        const mergedData = usersData.map((user) => {
          const userProfile = profileData.find(
            (profile) => profile.user_id === user._id,
          );
          return {
            ...user,
            profile: userProfile || {},
          };
        });
        setMergeData(mergedData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUsersAndProfiles();
  }, [accessToken]);
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
          {currentUser.admin && mergeData.length > 0 ? (
            mergeData.map((user) => (
              <tr
                key={user._id}
                className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800"
              >
                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {user.email}
                </td>

                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {user.profile.userName}
                </td>

                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {user.profile.sex}
                </td>

                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {user.profile.phone}
                </td>

                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Edit
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
