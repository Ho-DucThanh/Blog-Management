import { profileStart, profileSuccess, profileFailure } from "./ProfileSlice";

export const CreateProfileUser = async (
  profile,
  dispatch,
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
    setError("");
    alert("Profile created successfully");
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
    setError("");
  } catch (err) {
    setError(err.message);
    dispatch(profileFailure("aa" + err.message));
  }
};

export const getAllProfiles = async (accessToken, setError) => {
  try {
    const response = await fetch("http://localhost:3000/api/getAllProfiles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to load profiles");
    }

    return data;
  } catch (error) {
    setError(error.message);
  }
};
