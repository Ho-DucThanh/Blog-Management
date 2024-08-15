import Button from "../Common/Button";
import AuthInput from "../Common/AuthInput";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { ProfileUser } from "../../Redux/Home/Profile_apiRequest";
import { format } from "date-fns";

export default function ProfileForm() {
  const [formData, setFormData] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");
  const { loading } = useSelector((state) => state.profile.createProfile);
  const user = useSelector((state) => state.auth.login.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    if (e.target.id === "file-upload") {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setAvatar(reader.result);
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedDate = format(new Date(formData.date), "dd-MM-yyyy");

    const updateFormData = {
      ...formData,
      user_id: user._id,
      date: formattedDate,
      avatar: avatar || "",
    };
    setError("");
    console.log(updateFormData);
    ProfileUser(updateFormData, dispatch, navigate, setError);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label
        htmlFor="role"
        className="block text-sm font-medium leading-6 text-blue-700"
      >
        Hello {user?.email}
      </label>
      <div className="col-span-full">
        <label
          htmlFor="cover-photo"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Your Avatar
        </label>
        <div className="mt-2 flex rounded-lg border border-dashed border-gray-900/25 px-2">
          {avatar ? (
            <img
              src={avatar}
              alt="Selected Avatar"
              className="h-12 w-12 rounded-full"
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
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
      </div>
      <AuthInput
        label="User Name"
        id="userName"
        name="userName"
        type="text"
        onChange={handleChange}
      />
      <AuthInput
        label="Date of Birth"
        id="date"
        name="date"
        type="date"
        onChange={handleChange}
      />
      <div className="space-y-2">
        <label
          htmlFor="sex"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Sex
        </label>
        <select
          id="sex"
          name="sex"
          onChange={handleChange}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="role"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Role
        </label>
        <select
          id="role"
          name="role"
          onChange={handleChange}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        >
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
        </select>
      </div>
      <AuthInput
        label="Phone"
        id="phone"
        name="phone"
        type="text"
        onChange={handleChange}
      />
      <AuthInput
        label="Address"
        id="address"
        name="address"
        type="text"
        onChange={handleChange}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        disabled={loading}
        type="submit"
        children={loading ? "Loading..." : "Save"}
      ></Button>
    </form>
  );
}
