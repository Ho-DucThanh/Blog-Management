import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProfileByUserId } from "../../Redux/Home/Profile_apiRequest";
import {
  CalendarDateRangeIcon,
  HomeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function PersonalPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState([]);
  const { accessToken } = useSelector((state) => state.auth.login);

  const [isEditing, setIsEditing] = useState(false);
  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProfileByUserId(accessToken, id);
      setUserData(data);
    };
    fetchData();
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
            <div className="mt-4 flex space-x-4">
              <button className="rounded bg-blue-500 px-4 py-2 shadow hover:bg-blue-600">
                + Add Friend
              </button>
              <button
                onClick={handleEditProfile}
                className="rounded bg-gray-700 px-4 py-2 shadow hover:bg-gray-600"
              >
                Chỉnh sửa trang cá nhân
              </button>
            </div>
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
        <div className="w-1/3 rounded bg-gray-800 p-4 shadow">
          <h2 className="mb-4 text-xl font-semibold">Giới thiệu</h2>
          <div className="mt-4">
            <p className="flex items-center gap-4">
              <CalendarDateRangeIcon
                className="block h-8 w-8"
                aria-hidden="true"
              />
              <span className="font-bold">Birth Day {userData.date}</span>
            </p>

            <p className="flex items-center gap-5">
              <HomeIcon className="block h-8 w-8" aria-hidden="true" />
              <span className="font-bold">{userData.address}</span>
            </p>
            <button className="mt-2 w-full rounded bg-gray-700 py-2 shadow hover:bg-gray-600">
              Chỉnh sửa chi tiết
            </button>
          </div>
        </div>

        {/* Post Section */}
        <div className="flex-1 rounded bg-gray-800 p-4 shadow">
          <div className="mt-4">
            <h2 className="text-lg font-bold">Bài viết</h2>
            <p className="mt-2 text-gray-400">Chưa có bài viết nào.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
