import { profileStart, profileSuccess, profileFailure } from "./ProfileSlice";

export const CreateProfileUser = async (
  profile,
  dispatch,
  navigate,
  setError,
  accessToken,
) => {
  dispatch(profileStart());
  try {
    const response = await fetch("http://localhost:3000/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
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

export const getProfileUser = async (
  user_id,
  accessToken,
  dispatch,
  setError,
) => {
  dispatch(profileStart());
  try {
    const response = await fetch(
      `http://localhost:3000/api/profile/${user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.status === 404) {
      // Không có profile
      return null;
    }

    const data = await response.json();
    if (!response.status === 200) {
      throw new Error(data.message || "Failed to load profile");
    }

    console.log(data);
    dispatch(profileSuccess(data));

    return data;
  } catch (error) {
    setError(error.message);
    dispatch(profileFailure(error.message));
  }
};

export const updateProfileUser = async (
  profile,
  user_id,
  accessToken,
  dispatch,
  setError,
) => {
  dispatch(profileStart());
  try {
    const response = await fetch(
      `http://localhost:3000/api/profile/${user_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profile),
      },
    );

    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile");
    }

    console.log(data);
    dispatch(profileSuccess(data));
    alert("Profile updated successfully");
  } catch (err) {
    setError(err.message);
    dispatch(profileFailure(err.message));
  }
};
