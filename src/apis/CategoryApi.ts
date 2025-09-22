import type { Category } from "../models/Category";
import { api } from "./axios";

export async function getCategoriesApi() {
  return api
    .get<Category[]>("/categories")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching expenses:", error);
      throw error;
    });
}
