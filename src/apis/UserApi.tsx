import type {
  ConfirmInvitations,
  CreateGroupForm,
  CreateInvitationForm,
  GroupWithUsersrs,
  Invitations,
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

export async function addInvitationGroupApi(invitation: CreateInvitationForm) {
  return api
    .post("/groups/invite", invitation)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error adding a group:", error);
      throw error;
    });
}

export async function getAllInvitations() {
  return api
    .get<Invitations[]>("/groups/invitations")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching expenses:", error);
      throw error;
    });
}

export async function acceptRejectGroupInvitationApi(
  confirmInvitations: ConfirmInvitations
) {
  return api
    .post("/groups/invitations/" + confirmInvitations.id, confirmInvitations)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error adding a group:", error);
      throw error;
    });
}
