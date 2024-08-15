import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
} from "./AuthSlice";

export const loginUser = async (user, dispatch, setError) => {
  dispatch(loginStart());
  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to login");
    }

    console.log(data);
    dispatch(loginSuccess(data));
    alert("Login successful");
  } catch (error) {
    setError(error.message);
    dispatch(loginFailure(error.message));
  }
};

export const registerUser = async (user, dispatch, navigate, setError) => {
  dispatch(registerStart());
  try {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(data.message || "Failed to register");
    }

    const data = await response.json();
    console.log(data);
    dispatch(registerSuccess());
    alert("Registration successful");
    navigate("/login");
  } catch (error) {
    setError(error.message);
    dispatch(registerFailure(error.message));
  }
};
