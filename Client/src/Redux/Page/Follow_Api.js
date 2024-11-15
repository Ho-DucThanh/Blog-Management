export const followUser = async (accessToken, userId, followId) => {
  const response = await fetch("/api/follow/follow-user", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      followId,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to follow user");
  }
  return data;
};

export const unfollowUser = async (accessToken, userId, unfollowId) => {
  const url = "/api/follow/unfollow-user";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      unfollowId,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to unfollow user");
  }
  return data;
};

export const getFollowing = async (userId) => {
  const url = `/api/follow/get-following/${userId}`;
  const response = await fetch(url, {
    method: "GET",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to get following");
  }
  return data;
};

export const getFollowers = async (userId) => {
  const url = `/api/follow/get-followers/${userId}`;
  const response = await fetch(url, {
    method: "GET",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to get followers");
  }
  return data;
};

export const getFriends = async (userId) => {
  const url = `/api/follow/get-friends/${userId}`;
  const response = await fetch(url, {
    method: "GET",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to get friends");
  }
  return data;
};

export const getUserNewsFeed = async (userId) => {
  const url = `/api/follow/get-user-newsfeed/${userId}`;
  const response = await fetch(url, {
    method: "GET",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to get user news feed");
  }
  return data;
};

export const getNotifications = async (userId) => {
  const url = `/api/notification/getNotifications/${userId}`;
  const response = await fetch(url, {
    method: "GET",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to get notifications");
  }
  return data;
};
