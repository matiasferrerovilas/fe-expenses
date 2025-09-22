import type { Balance } from "../models/Balance";
import { api } from "./axios";

export async function getBalance() {
  return api
    .get<Balance[]>("/balance")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching expenses:", error);
      throw error;
    });
}
