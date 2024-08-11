import React, { useContext } from "react";
import AuthInput from "../Common/AuthInput";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { ProfileContext } from "../../Context/Auth/ProfileContext";

export default function ProfileForm() {
  const {
    avatar,
    userName,
    date,
    sex,
    role,
    phone,
    address,
    error,
    setAvatar,
    setUserName,
    setDate,
    setSex,
    setRole,
    setPhone,
    setAddress,
    handleSubmit,
  } = useContext(ProfileContext);

  return (
    <form
      action="#"
      method="POST"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="col-span-full">
        <label
          htmlFor="cover-photo"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Your Avatar
        </label>
        <div className="mt-2 flex rounded-lg border border-dashed border-gray-900/25 px-2">
          {avatar ? (
            <img src={avatar} alt="avatar" className="h-12 w-12 rounded-full" />
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
                onChange={(e) =>
                  setAvatar(URL.createObjectURL(e.target.files[0]))
                }
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
        autoComplete="userName"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <AuthInput
        label="Date of Birth"
        id="date"
        name="date"
        type="date"
        autoComplete="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
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
          autoComplete="sex"
          value={sex}
          onChange={(e) => setSex(e.target.value)}
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
          autoComplete="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
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
        autoComplete="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <AuthInput
        label="Address"
        id="address"
        name="address"
        type="text"
        autoComplete="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="mt-6 flex items-center justify-center gap-x-6">
        <button
          type="button"
          className="rounded-md bg-slate-100 px-2 py-2 text-sm font-semibold text-gray-900 hover:bg-indigo-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Save
        </button>
      </div>
    </form>
  );
}
