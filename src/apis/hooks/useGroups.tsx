import { useQuery } from "@tanstack/react-query";
import {
  getAllGroupsWithUsers,
  getAllInvitations,
  getAllUserGroups,
} from "../GroupApi";

const USER_GROUPS_COUNT_QUERY_KEY = "user-groups-count" as const;
const USER_GROUPS_QUERY_KEY = "user-groups" as const;
const INVITATIONS_GROUPS_QUERY_KEY = "invitations-groups" as const;

export const useGroups = () =>
  useQuery({
    queryKey: [USER_GROUPS_QUERY_KEY],
    queryFn: () => getAllUserGroups(),
    staleTime: 5 * 60 * 1000,
  });

export const useAllGroupsWithUsers = () =>
  useQuery({
    queryKey: [USER_GROUPS_COUNT_QUERY_KEY],
    queryFn: () => getAllGroupsWithUsers(),
    staleTime: 5 * 60 * 1000,
  });

export const useInvitations = () =>
  useQuery({
    queryKey: [INVITATIONS_GROUPS_QUERY_KEY],
    queryFn: () => getAllInvitations(),
    staleTime: 5 * 60 * 1000,
  });
