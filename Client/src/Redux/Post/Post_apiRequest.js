import { postStart, postSuccess, postFailure } from "./PostSlice";

export const createPost_Api = async (
  post,
  accessToken,
  dispatch,
  navigate,
  setError,
) => {
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
      throw new Error(data.message || "Failed to create post");
    }

    console.log(data);
    dispatch(postSuccess(data));
    setError("");
    alert("Post created successfully");
    navigate(`/post/${data.slug}`);
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

export const deletePost = async (postId, userId, accessToken) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/post/deletepost/${postId}/${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete post");
    }

    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (
  postId,
  userId,
  post,
  accessToken,
  navigate,
) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/post/updatepost/${postId}/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(post),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update post");
    }

    console.log(data);
    alert("Post updated successfully");
    navigate(`/post/${data.slug}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
