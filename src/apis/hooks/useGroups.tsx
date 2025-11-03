import { useQuery } from "@tanstack/react-query";
import { getAllUserGroups } from "../UserApi";

const USER_GROUPS_QUERY_KEY = "user-groups" as const;

export const useGroups = () =>
  useQuery({
    queryKey: [USER_GROUPS_QUERY_KEY],
    queryFn: () => getAllUserGroups(),
    staleTime: 5 * 60 * 1000,
  });
