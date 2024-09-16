import { useState } from "react";
import AuthInput from "../Common/AuthInput";
import Button from "../Common/Button";
import { useSelector } from "react-redux";
import { changPasswordUser } from "../../Redux/Auth/Auth_apiRequest";

export default function ChangePassword() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  const { currentUser, accessToken, loading } = useSelector(
    (state) => state.auth.login,
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    await changPasswordUser(accessToken, currentUser._id, formData, setError);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center">
        <label className="rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-2 py-1 text-white">
          Email address
        </label>
        <span className="pl-2 font-medium text-gray-500">
          {currentUser.email}
        </span>{" "}
      </div>
      <AuthInput
        label="Old Password"
        id="oldPassword"
        name="oldPassword"
        type="password"
        onChange={handleChange}
      />
      <AuthInput
        label="New Password"
        id="newPassword"
        name="newPassword"
        type="password"
        onChange={handleChange}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        disabled={loading}
        type="submit"
        children={loading ? "Loading..." : "Update"}
      ></Button>
    </form>
  );
}
