import { useQuery } from "@tanstack/react-query";
import { getLastIngreso } from "../SettingApi";

const SETTING_QUERY_KEY = "setting-history" as const;

export const useSettingsLastIngreso = () =>
  useQuery({
    queryKey: [SETTING_QUERY_KEY],
    queryFn: () => getLastIngreso(),
    staleTime: Infinity,
  });
