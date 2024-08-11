import AuthInput from "../Common/AuthInput";
import Button from "../Common/Button";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../Redux/Auth/AuthSlice";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [formData, setFormData] = React.useState({});
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (data.success === false) {
        dispatch(loginFailure(data.message));
        return;
      }
      dispatch(loginSuccess(data));
      alert("Login successful");
      navigate("/profile");
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AuthInput
        label="Email Address"
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        value=""
        onChange={handleChange}
      />
      <AuthInput
        label="Password"
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        value=""
        onChange={handleChange}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div>
        <Button type="submit" children="Sign in"></Button>
      </div>
    </form>
  );
}
