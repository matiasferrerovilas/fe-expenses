import { useQuery } from "@tanstack/react-query";
import { getServicesApi } from "../ServiceApi";

const SERVICE_KEY = ["service-history"] as const;

export const useService = () =>
  useQuery({
    queryKey: SERVICE_KEY,
    queryFn: () => getServicesApi(),
    staleTime: 5 * 60 * 1000,
    select: (data) => data,
  });
