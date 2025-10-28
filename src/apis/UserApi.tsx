import type { UserGroup } from "../models/UserGroup";
import { api } from "./axios";

export async function getAllUserGroups() {
  return api
    .get<UserGroup[]>("/user/groups")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching expenses:", error);
      throw error;
    });
}
