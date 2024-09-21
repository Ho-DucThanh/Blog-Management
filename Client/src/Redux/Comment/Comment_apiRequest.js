export const createComment = async (
  accessToken,
  postId,
  userId,
  content,
  setError,
) => {
  try {
    const response = await fetch("/api/comment/createComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        postId,
        userId,
        content,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create comment");
    }

    return data;
  } catch (error) {
    setError(error.message);
  }
};

export const getCommentsByPostId = async (accessToken, postId) => {
  try {
    const response = await fetch(`/api/comment/getCommentsByPostId/${postId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to get comments");
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editComment = async (accessToken, commentId, content) => {
  try {
    const response = await fetch(`/api/comment/editComment/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ content }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to edit comment");
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteComment = async (accessToken, commentId) => {
  try {
    const response = await fetch(`/api/comment/deleteComment/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete comment");
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsByUserId = async (accessToken, userId) => {
  try {
    const response = await fetch(`/api/comment/getCommentsByUserId/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to get comments");
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const likeComment = async (accessToken, commentId) => {
  try {
    const response = await fetch(`/api/comment/likeComment/${commentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to like comment");
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllComments = async (accessToken) => {
  try {
    const response = await fetch("/api/comment/getAllComments", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to get comments");
    }
    return data;
  } catch (err) {
    console.log(err);
  }
};
