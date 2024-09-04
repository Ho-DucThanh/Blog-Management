import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getProfileUser,
  CreateProfileUser,
  updateProfileUser,
} from "../../Redux/Home/Profile_apiRequest";
import { format } from "date-fns";
import Button from "../Common/Button";
import AuthInput from "../Common/AuthInput";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    userName: "",
    date: "",
    sex: "",
    phone: "",
    address: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");
  const { loading } = useSelector((state) => state.profile.createProfile);
  const { currentUser, accessToken } = useSelector((state) => state.auth.login);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser && accessToken) {
      getProfileUser(currentUser._id, accessToken, dispatch, setError).then(
        (response) => {
          const profile = response?.profile;
          if (profile) {
            setFormData({
              userName: profile.userName || "",
              date: format(new Date(profile.date), "yyyy-MM-dd"),
              sex: profile.sex || "",
              phone: profile.phone || "",
              address: profile.address || "",
            });
            setAvatar(profile.avatar || null);
          }
        },
      );
    }
  }, [currentUser, accessToken, dispatch]);

  const handleInputChange = (e) => {
    const { id, value, files } = e.target;

    if (id === "file-upload" && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser || !accessToken) {
      setError("User information or access token is missing");
      return;
    }

    getProfileUser(currentUser._id, accessToken, dispatch, setError).then(
      (existingProfile) => {
        const updateFormData = {
          ...formData,
          user_id: currentUser._id,
          date: format(new Date(formData.date), "dd-MM-yyyy"),
          avatar: avatar || "",
        };

        if (!existingProfile) {
          // Nếu profile chưa tồn tại, gọi hàm CreateProfileUser
          CreateProfileUser(updateFormData, dispatch, setError, accessToken);
        } else {
          // Nếu profile đã tồn tại, gọi hàm updateProfileUser
          updateProfileUser(
            updateFormData,
            currentUser._id,
            accessToken,
            dispatch,
            setError,
          );
        }
      },
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Profile</h2>
        </div>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-3/5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <span className="rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-2 py-1 text-white">
            Email
          </span>
          <span className="font-bold text-blue-600"> {currentUser.email}</span>
          <AvatarInput avatar={avatar} onChange={handleInputChange} />

          <AuthInput
            label="User Name"
            id="userName"
            type="text"
            value={formData.userName}
            onChange={handleInputChange}
          />
          <AuthInput
            label="Date of Birth"
            id="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
          />

          <SelectInput
            label="Sex"
            id="sex"
            options={["male", "female"]}
            value={formData.sex}
            onChange={handleInputChange}
          />

          <AuthInput
            label="Phone"
            id="phone"
            type="text"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <AuthInput
            label="Address"
            id="address"
            type="text"
            value={formData.address}
            onChange={handleInputChange}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button disabled={loading} type="submit">
            {loading ? "Loading..." : "Save"}
          </Button>
        </form>
      </div>
    </div>
  );
}

const AvatarInput = ({ avatar, onChange }) => (
  <div className="col-span-full">
    <label className="block text-sm font-medium leading-6 text-gray-900">
      Your Avatar
    </label>
    <div className="mt-2 flex rounded-lg border border-dashed border-gray-900/25 px-2">
      {avatar ? (
        <img
          src={avatar}
          alt="Selected Avatar"
          className="h-12 w-12 rounded-full object-cover"
        />
      ) : (
        <UserCircleIcon
          aria-hidden="true"
          className="h-12 w-12 text-gray-300"
        />
      )}
      <div className="flex px-2 py-2 text-sm leading-6 text-gray-600">
        <label
          htmlFor="file-upload"
          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
        >
          <span>Upload a file</span>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            onChange={onChange}
          />
        </label>
      </div>
    </div>
  </div>
);

const SelectInput = ({ label, id, options, value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium leading-6 text-gray-900">
      {label}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
  </div>
);
