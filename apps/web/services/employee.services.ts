import { useSuspenseQuery } from "@tanstack/react-query";
import { apiService } from "../lib/apiService";
import type { Employee } from "@repo/drizzle/src/types";

export const useEmployees = () => {
  return useSuspenseQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await apiService<{ data: Employee[] }>(`/api/employees`);

      return res.data;
    },
  });
};
