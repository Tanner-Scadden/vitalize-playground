import { getSchedules } from "@repo/drizzle/src/repositories/schedule.repository";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(request: NextApiRequest) {
  if (!request.url) {
    return NextResponse.json(
      { message: "Request URL is required" },
      { status: 400 },
    );
  }

  const url = new URL(request.url);
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  if (!start) {
    return NextResponse.json(
      { message: "Start date is required" },
      { status: 400 },
    );
  }

  if (!end) {
    return NextResponse.json(
      { message: "End date is required" },
      { status: 400 },
    );
  }

  const schedules = await getSchedules({
    greaterThanDate: start,
    lessThanDate: end,
  });

  // Group by is not supported yet :(
  // const employeeSchedule = Object.groupBy(schedules, (item) => item.employeeId);

  const employeeSchedule = schedules.reduce<Record<number, typeof schedules>>(
    (acc, schedule) => {
      if (!acc[schedule.employeeId]) {
        acc[schedule.employeeId] = [];
      }

      acc[schedule.employeeId]!.push(schedule);

      return acc;
    },
    {},
  );

  return NextResponse.json({ data: employeeSchedule }, { status: 200 });
}
