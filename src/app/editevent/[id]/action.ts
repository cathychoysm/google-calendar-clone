"use server";

import { prisma } from "../../../../prisma/prisma";
import { redirect } from "next/navigation";

import { eventValidations } from "@/app/month/[month]/action";
import { loginIsRequiredServer } from "@/lib/auth";

export async function getEventData(id: string): Promise<CalendarEvent> {
  const session = await loginIsRequiredServer();

  const eventData: CalendarEvent[] = await prisma.$queryRaw`
		SELECT
			"Event"."id",
			"Event"."title",
			"Event"."isAllDay",
			to_char("Event"."startAt", 'YYYY-MM-DD') AS "startDate",
			to_char("Event"."endAt", 'YYYY-MM-DD') AS "endDate",
			to_char("Event"."startAt", 'HH24:MI') AS "startTime",
			to_char("Event"."endAt", 'HH24:MI') AS "endTime",
			"Event"."description",
			"Event"."color",
			"Calendar"."id" AS "calendarId",
			"Calendar"."name" AS calendar
		FROM "Event"
		LEFT JOIN "Calendar" ON "Event"."calendarId" = "Calendar"."id"
		WHERE "Event"."userId" = ${session.user.id}
			AND "Event"."id" = ${id}
	`;
  if (!eventData) return redirect("/");
  return eventData[0];
}

export async function updateEvent(eventData: CalendarEvent) {
  const validations = await eventValidations(eventData);

  if (!validations) return { status: 500 };

  const updatedEvent = await prisma.event.update({
    where: {
      id: eventData.id,
    },
    data: {
      title: eventData.title,
      isAllDay: eventData.isAllDay,
      startAt: new Date(
        `${eventData.startDate} ${
          eventData.isAllDay ? "00:00" : eventData.startTime
        } UTC`
      ),
      endAt: new Date(
        `${eventData.endDate} ${
          eventData.isAllDay ? "00:00" : eventData.endTime
        } UTC`
      ),
      description: eventData.description,
      calendarId: eventData.calendarId,
      color: eventData.color,
    },
  });

  if (!updatedEvent) return { status: 500 };

  return { status: 200 };
}
