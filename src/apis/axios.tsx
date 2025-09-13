import axios from "axios";

export const api = axios.create({
  baseURL: window.env.backend.api,
  timeout: 5000,
});
