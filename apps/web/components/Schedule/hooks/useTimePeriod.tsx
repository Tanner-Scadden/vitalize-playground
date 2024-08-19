import { useSearchParams } from "next/navigation";
import { useMemo, useRef } from "react";

const ONE_DAY = 24 * 60 * 60 * 1_000;
const ONE_WEEK = ONE_DAY * 7;
const ONE_MONTH = ONE_WEEK * 30;

function formatDate(date: string) {
  return date.slice(0, 10);
}

function getMonday(d: Date) {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(new Date(d).setDate(diff));
}

const getOneMonthAway = (startPeriod: string) => {
  const start = new Date(startPeriod);
  const oneMonthAway = new Date(start.getTime() + ONE_MONTH);

  return formatDate(oneMonthAway.toISOString());
};

export const useTimePeriod = () => {
  const params = useSearchParams();
  const nowRef = useRef(formatDate(new Date().toISOString()));

  const todayParam = params.get("today");

  return useMemo(() => {
    const now = todayParam || nowRef.current;
    const oneMonthAway = getOneMonthAway(now);

    return { today: now, oneMonthAway };
  }, [todayParam]);
};

export const useTimePeriodWeeks = () => {
  const { today, oneMonthAway } = useTimePeriod();

  const weeks = useMemo((): Array<string[]> => {
    const timePeriods: string[][] = [];
    const startDate = getMonday(new Date(today));

    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(startDate.getTime() + ONE_WEEK * i);
      const week = [];

      for (let j = 0; j < 7; j++) {
        const day = new Date(weekStart.getTime() + j * ONE_DAY);
        week.push(day.toISOString().slice(0, 10));
      }

      timePeriods.push(week);
    }

    return timePeriods;
  }, [today, oneMonthAway]);

  const days = useMemo(() => weeks.flat(), [weeks]);

  return { weeks, days };
};
