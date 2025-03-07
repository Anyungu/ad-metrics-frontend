import { useQuery } from "@tanstack/react-query";
import { fetAdMetrics } from "@/api/api";

export const useFetchAdMetrics = (query: string) => {
  return useQuery({
    queryKey: ["ad_metrics", query],
    queryFn: () => fetAdMetrics(query),
  });
};
