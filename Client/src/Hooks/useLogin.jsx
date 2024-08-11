import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log(response.data);
      setError("");
      alert("Login successful");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("An error occurred while logging in");
    }
  };

  return {
    email,
    password,
    error,
    setEmail,
    setPassword,
    handleSubmit,
  };
};

export default useLogin;
