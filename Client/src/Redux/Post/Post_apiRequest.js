import { postStart, postSuccess, postFailure } from "./PostSlice";

export const createPost_Api = async (post, accessToken, dispatch, setError) => {
  dispatch(postStart());
  try {
    const response = await fetch("http://localhost:3000/api/post/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(post),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create profile");
    }

    console.log(data);
    dispatch(postSuccess(data));
    setError("");
    alert("Post created successfully");
  } catch (error) {
    setError(error.message);
    dispatch(postFailure(error.message));
  }
};

export const getAllPost = async (accessToken) => {
  try {
    const response = await fetch("http://localhost:3000/api/post/getAllPost", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to load posts");
    }

    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
