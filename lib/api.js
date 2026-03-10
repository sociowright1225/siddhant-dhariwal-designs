import axios from "axios";

const api = axios.create({
  baseURL: "https://siddhant-dhariwal-designs-e6u4.vercel.app/api",
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default api;