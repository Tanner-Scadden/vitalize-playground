"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTimePeriodWeeks } from "./hooks/useTimePeriod";
import { useSchedule } from "@/services/schedule.services";
import { useEmployees } from "@/services/employee.services";
import { Employee } from "@repo/drizzle/src/types.ts";
import { useReactQuerySubscription } from "@/hooks/useWebsocketConnection";

const DisplayTableRow = ({
  employee,
  socket,
}: {
  employee: Employee;
  socket: WebSocket;
}) => {
  const { data: schedule } = useSchedule();
  const { days } = useTimePeriodWeeks();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  useEffect(() => {
    const employeeSchedule = schedule?.[employee.id];
    if (!employeeSchedule) return;

    setSelectedDates(employeeSchedule?.map((s) => s.date));
  }, [schedule]);

  const handleAdd = (date: string) => {
    socket.send(
      JSON.stringify({
        type: "create",
        data: {
          employeeId: employee.id,
          date,
          shiftTypeId: 1,
          status: "Scheduled",
        },
      }),
    );
  };

  const handleRemove = (date: string) => {
    const id = schedule[employee.id]!.find((s) => s.date === date)?.id;
    if (!id) return;

    socket.send(
      JSON.stringify({
        type: "delete",
        data: id,
      }),
    );
  };

  return (
    <TableRow>
      <TableCell className="font-medium sticky border-r-4">
        {employee.firstName} {employee.lastName}
      </TableCell>
      {days.map((day) => {
        const selected = selectedDates.includes(day);
        return (
          <TableCell
            key={day}
            className={`p-0 cursor-pointer border-r hover:bg-gray-500 ${selected ? "bg-gray-600" : ""}`}
            onClick={() => (selected ? handleRemove(day) : handleAdd(day))}
          />
        );
      })}
    </TableRow>
  );
};

function DisplayTable() {
  const { data: employees } = useEmployees();

  const { webSocket } = useReactQuerySubscription();

  return (
    <TableBody>
      {employees &&
        employees.map((employee) => (
          <DisplayTableRow
            key={employee.id}
            employee={employee}
            socket={webSocket}
          />
        ))}
    </TableBody>
  );
}

const LoadingRow = () => {
  const { days } = useTimePeriodWeeks();

  return (
    <TableRow className="animate-pulse">
      <TableCell className="border-r-4 bg-slate-900" />
      {days.map((day) => (
        <TableCell key={day} className="h-12 bg-slate-900" />
      ))}
    </TableRow>
  );
};

const DisplayTableLoading = () => {
  const { days } = useTimePeriodWeeks();

  const { rows } = useMemo(() => {
    return {
      rows: Array.from({ length: 8 }, (_, index) => index),
    };
  }, [days]);

  return (
    <TableBody>
      {rows.map((row) => (
        <LoadingRow key={row} />
      ))}
    </TableBody>
  );
};

const DiplayTableError = () => (
  <TableBody>
    <h3>Error :(</h3>
  </TableBody>
);

const ScheduleHeader = () => {
  const { weeks, days } = useTimePeriodWeeks();

  const today = useRef(new Date().toISOString().slice(0, 10));

  return (
    <TableHeader>
      <TableRow className="hover:bg-inherit">
        <TableHead
          className="w-[100px] sticky border-r-4 font-bold text-xl"
          rowSpan={2}
        >
          Employee
        </TableHead>
        {weeks.map((week, index) => {
          const startDate = new Date(week.at(0)!);
          const endDate = new Date(week.at(-1)!);

          const label = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

          const isThisWeek = week.includes(today.current);

          return (
            <TableHead
              key={`week_${index}`}
              className={`px-0 text-center border-r-2 ${isThisWeek ? "bg-gray-100" : ""}`}
              colSpan={week.length}
            >
              {label}
            </TableHead>
          );
        })}
      </TableRow>
      <TableRow className="p-0 hover:bg-inherit">
        {days.map((day) => {
          const date = new Date(day);

          const isToday = day === today.current;
          return (
            <TableHead
              key={day}
              className={`h-unset text-center p-0 border-r ${isToday ? "bg-gray-100" : ""}`}
              style={{
                minWidth: "1.25rem",
                width: "1.25rem",
                maxWidth: "1.25rem",
              }}
            >
              {date.getMonth() + 1}/{date.getDate()}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
};

export function Schedule() {
  return (
    <Table className="p-4">
      <TableCaption>Employee's schedule manager</TableCaption>
      <ScheduleHeader />
      <ErrorBoundary fallback={<DiplayTableError />}>
        <Suspense fallback={<DisplayTableLoading />}>
          <DisplayTable />
        </Suspense>
      </ErrorBoundary>
    </Table>
  );
}
