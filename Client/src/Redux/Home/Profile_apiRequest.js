import { profileStart, profileSuccess, profileFailure } from "./ProfileSlice";

export const ProfileUser = async (profile, dispatch, navigate, setError) => {
  dispatch(profileStart());
  try {
    const response = await fetch("http://localhost:3000/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create profile");
    }

    console.log(data);
    dispatch(profileSuccess(data));
    alert("Profile created successfully");
    navigate("/");
  } catch (error) {
    setError(error.message);
    dispatch(profileFailure(error.message));
  }
};

export const getProfileUser = async (user_id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/profile/${user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create profile");
    }

    return !!data;
  } catch (error) {
    throw new Error(error.message);
  }
};
