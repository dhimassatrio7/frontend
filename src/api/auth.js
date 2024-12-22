import { axiosInstance } from "../lib/axios";

export const login = async (credentials) => {
  const response = await axiosInstance.post("/auth/local", credentials);
  return response.data;
};

export const register = async (data) => {
  const response = await axiosInstance.post("/auth/local/register", data);
  return response.data;
};
