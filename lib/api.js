import axios from "axios";

const api = axios.create({
  baseURL: "https://siddhant-dhariwal-designs-7m36.vercel.app/api",
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default api;
