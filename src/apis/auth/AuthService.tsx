import { api } from "../axios";

export async function getIsFirstLogin() {
  return api
    .get<boolean>("/onboarding/is-first")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching services:", error);
      throw error;
    });
}
