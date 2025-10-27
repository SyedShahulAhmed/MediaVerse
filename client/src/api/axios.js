// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://mediaverse-g74z.onrender.com/api", // ✅ deployed backend URL
  withCredentials: true,
});

// ✅ Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 👥 Follow routes — returns JSON directly
export const followUser = async (userId) => {
  const { data } = await API.post(`/users/follow/${userId}`);
  return data; // { message, followersCount, newBadges }
};

export const unfollowUser = async (userId) => {
  const { data } = await API.post(`/users/unfollow/${userId}`);
  return data; // { message, followersCount }
};

// ✅ Default export
export default API;
