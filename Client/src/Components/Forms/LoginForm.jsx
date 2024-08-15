import AuthInput from "../Common/AuthInput";
import Button from "../Common/Button";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../Redux/Auth/Auth_apiRequest";
import { getProfileUser } from "../../Redux/Home/Profile_apiRequest";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const user = useSelector((state) => state.auth.login.currentUser);
  const loading = useSelector((state) => state.auth.login.loading);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      getProfileUser(user._id)
        .then((profile) => {
          if (profile) navigate("/");
          else navigate("/profile");
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    loginUser(formData, dispatch, setError);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AuthInput
        label="Email Address"
        id="email"
        name="email"
        type="email"
        onChange={handleChange}
      />
      <AuthInput
        label="Password"
        id="password"
        name="password"
        type="password"
        onChange={handleChange}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        disabled={loading}
        type="submit"
        children={loading ? "Loading..." : "Sign In"}
      ></Button>
    </form>
  );
}
