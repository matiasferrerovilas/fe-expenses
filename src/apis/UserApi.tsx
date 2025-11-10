import type {
  CreateGroupForm,
  GroupWithUsersrs,
  UserGroup,
} from "../models/UserGroup";
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

export async function getAllGroupsWithUsers() {
  return api
    .get<GroupWithUsersrs[]>("/user/all-groups")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching expenses:", error);
      throw error;
    });
}

export async function addGroupApi(group: CreateGroupForm) {
  return api
    .post("/groups", group)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error adding a group:", error);
      throw error;
    });
}
