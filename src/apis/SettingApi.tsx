import type { LastIngreso } from "../models/Movement";
import { api } from "./axios";

export async function getLastIngreso() {
  return api
    .get<LastIngreso>("/settings")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching expenses:", error);
      throw error;
    });
}
