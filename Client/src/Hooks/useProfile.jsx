import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useProfile = () => {
  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [date, setDate] = useState("");
  const [sex, setSex] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !date || !sex || !role || !phone || !address) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/profile",
        {
          avatar,
          userName,
          date,
          sex,
          role,
          phone,
          address,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log(response.data);
      setError("");
      alert("Profile updated successfully");
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Error updating profile");
    }
  };
  return {
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
  };
};

export default useProfile;
