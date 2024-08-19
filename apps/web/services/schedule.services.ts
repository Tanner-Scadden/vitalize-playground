import { useSuspenseQuery } from "@tanstack/react-query";
import { apiService } from "../lib/apiService";
import { useTimePeriod } from "@/components/Schedule/hooks/useTimePeriod";
import { Schedule } from "@repo/drizzle/src/types.ts";

/**
 * Fetches the next months schedule. It is returned grouped by employeeID.
 */
export const useSchedule = () => {
  const { today, oneMonthAway } = useTimePeriod();

  return useSuspenseQuery({
    queryKey: ["schedule", today, oneMonthAway],
    queryFn: async () => {
      const res = await apiService<{ data: Record<number, Schedule[]> }>(
        `/api/schedule?start=${today}&end=${oneMonthAway}`,
      );

      return res.data;
    },
  });
};
