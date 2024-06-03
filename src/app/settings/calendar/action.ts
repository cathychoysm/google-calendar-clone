"use server";

import { prisma } from "../../../../prisma/prisma";
import { redirect } from "next/navigation";

import { calendarColorOptions } from "@/lib/data";
import { loginIsRequiredServer } from "@/lib/auth";

export async function createCalendar(data: CalendarFormData) {
  const session = await loginIsRequiredServer();

  // Validations
  if (
    !data.name ||
    data.name.length > 254 ||
    !data.color ||
    !calendarColorOptions.hasOwnProperty(data.color)
  )
    return { status: 500 };

  // Create calendar in Db if all checks passed
  const newCalendar = await prisma.calendar.create({
    data: {
      name: data.name.trim(),
      defaultColor: data.color,
      userId: session.user.id,
    },
  });

  return { status: 200 };
}

export async function getCalendar(id: string): Promise<Calendar> {
  const calendar = await prisma.calendar.findUnique({
    where: {
      id: id,
    },
  });

  if (!calendar) return redirect("/");

  return calendar;
}

export async function updateCalendar(calendar: Calendar) {
  // Validations
  if (
    !calendar.name ||
    calendar.name.length > 254 ||
    !calendar.defaultColor ||
    !calendarColorOptions.hasOwnProperty(calendar.defaultColor)
  )
    return { status: 500 };

  const updateCalendar = await prisma.calendar.update({
    where: {
      id: calendar.id,
    },
    data: {
      name: calendar.name,
      defaultColor: calendar.defaultColor,
      show: calendar.show,
    },
  });

  if (!updateCalendar) return { status: 500 };
  return { status: 200 };
}

export async function deleteCalendar(id: string) {
  const deleteAllEvents = await prisma.event.deleteMany({
    where: {
      calendarId: id,
    },
  });

  const deleteCalendar = await prisma.calendar.delete({
    where: {
      id: id,
    },
  });

  return redirect("/settings/calendar");
}
