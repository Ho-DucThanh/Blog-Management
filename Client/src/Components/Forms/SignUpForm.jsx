import AuthInput from "../Common/AuthInput";
import Button from "../Common/Button";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "../../Redux/Auth/Auth_apiRequest";
import { useNavigate } from "react-router-dom";

const validateEmail = (email) => {
  const emailRegex = /^[A-Za-z0-9]+@[A-Za-z]+\.(com|edu\.vn)$/;
  return emailRegex.test(email);
};

export default function SignUpForm() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formData;
    // Xác thực thông tin đầu vào
    if (!email || !password || !confirmPassword) {
      setError("Please enter all fields");
      return;
    }

    if (!validateEmail(email)) {
      setError(
        "Invalid email format. Please enter a valid email address (...@abc.com || ...@abc.edu.vn)",
      );
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    registerUser(formData, dispatch, navigate, setError);
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

      <AuthInput
        label="Confirm Password"
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        onChange={handleChange}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div>
        <Button
          disabled={loading}
          type="submit"
          children={loading ? "Loading..." : "Sign Up"}
        ></Button>
      </div>
    </form>
  );
}
