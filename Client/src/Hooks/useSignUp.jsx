import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9]+@[A-Za-z]+\.(com|edu\.vn)$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password");
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
      setError("Password do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          email,
          password,
        },
      );
      console.log(response);
      setError("");
      alert("Account created successfully");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error(err);
      setError("An error occurred while signing up");
    }
  };

  return {
    email,
    password,
    confirmPassword,
    error,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  };
};

export default useSignUp;
