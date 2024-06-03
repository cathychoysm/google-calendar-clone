"use server";

import { isAfter, isValid, lightFormat, parse } from "date-fns";
import { prisma } from "../../../../prisma/prisma";

import { isStartTimeBeforeEndTime } from "@/lib/functions";
import { loginIsRequiredServer } from "@/lib/auth";

export async function getCalendars(): Promise<Calendar[]> {
  const session = await loginIsRequiredServer();

  const calendars = await prisma.calendar.findMany({
    where: {
      userId: session.user.id as string,
    },
    select: {
      id: true,
      name: true,
      defaultColor: true,
      show: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return calendars;
}

export async function getDatesWithEvents(
  month: string
): Promise<DatesWithEvents> {
  const session = await loginIsRequiredServer();

  const datesWithEvents: DatesWithEvents = await prisma.$queryRaw`
  	WITH dates AS (
  		SELECT
				generate_series(
					date_trunc('week', ${month}::timestamp),
					date_trunc('week', ${month}::timestamp) + interval '41 days',
					'1 day'::interval
  			)::date AS date
  	),
		events_expanded AS (
			SELECT
				generate_series(
					date_trunc('day', "Event"."startAt"),
					date_trunc('day', "Event"."endAt"),
					'1 day'::interval
				)::date AS date,
				"Event"."id",
				"Event"."title",
				"Event"."isAllDay",
				to_char("Event"."startAt", 'YYYY-MM-DD') AS startDate,
				to_char("Event"."endAt", 'YYYY-MM-DD') AS endDate,
				to_char("Event"."startAt", 'HH24:MI') AS startTime,
				to_char("Event"."endAt", 'HH24:MI') AS endTime,
				"Event"."description",
				"Event"."color",
				"Calendar"."name" AS calendar,
				"Calendar"."show" AS show
			FROM "Event"
			LEFT JOIN "Calendar" ON "Event"."calendarId" = "Calendar"."id"
			WHERE "Event"."userId" = ${session.user.id}
		)
  	SELECT
			to_char(dates.date, 'YYYY-MM-DD') AS date,
			COALESCE(
				jsonb_agg(
					jsonb_build_object(
						'id', events.id,
						'title', events.title,
						'isAllDay', case when events.startDate <> events.endDate then true else events."isAllDay" end,
						'startDate', events.startDate,
						'endDate', events.endDate,
						'startTime', events.startTime,
						'endTime', events.endTime,
						'description', events.description,
						'color', events.color,
						'calendar', events.calendar,
						'show', events.show
					) ORDER BY events.startTime
				) FILTER (WHERE events.id IS NOT NULL),
				'[]'::jsonb
			) AS events
  	FROM dates
  	LEFT JOIN events_expanded AS events USING (date)
		GROUP BY date
		ORDER BY date
  `;

  return datesWithEvents;
}

export async function eventValidations(
  eventData: EventFormData | CalendarEvent
): Promise<boolean> {
  const session = await loginIsRequiredServer();

  function checkDateFormat(dateString: string): boolean {
    const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
    return (
      isValid(parsedDate) &&
      dateString === lightFormat(parsedDate, "yyyy-MM-dd")
    );
  }

  function checkTimeFormat(timeString: string): boolean {
    const regex = /^([01]\d|2[0-3]):[0-5]\d$/;
    return regex.test(timeString);
  }

  const calendar = await prisma.calendar.findUnique({
    where: {
      id: eventData.calendarId,
      userId: session.user.id,
    },
  });

  if (
    // title
    eventData.title.length > 100 ||
    // isAllDay
    typeof eventData.isAllDay !== "boolean" ||
    // startDate
    !eventData.startDate ||
    !checkDateFormat(eventData.startDate) ||
    // endDate
    !eventData.endDate ||
    !checkDateFormat(eventData.endDate) ||
    isAfter(new Date(eventData.startDate), new Date(eventData.endDate)) ||
    (!eventData.isAllDay
      ? // startTime
        !eventData.startTime ||
        !checkTimeFormat(eventData.startTime) ||
        // endTime
        !eventData.endTime ||
        !checkTimeFormat(eventData.endTime) ||
        !isStartTimeBeforeEndTime(
          eventData.startDate,
          eventData.endDate,
          eventData.startTime,
          eventData.endTime
        )
      : false) ||
    // description
    eventData.description.length > 500 ||
    // calendarId
    !eventData.calendarId ||
    !calendar
  )
    return false;
  return true;
}

export async function createEvent(eventData: EventFormData) {
  const session = await loginIsRequiredServer();

  const validations = await eventValidations(eventData);
  if (!validations) return { status: 500 };

  const newEvent = await prisma.event.create({
    data: {
      title: eventData.title ? eventData.title : "(No title)",
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
      color: eventData.color,
      userId: session.user.id,
      calendarId: eventData.calendarId,
    },
  });
  return { status: 200 };
}

export async function deleteEvent(id: string) {
  const deleteEvent = await prisma.event.delete({
    where: {
      id: id,
    },
  });
}

export async function toggleCalendar(id: string, newShow: boolean) {
  const toggleCalendar = await prisma.calendar.update({
    where: {
      id: id,
    },
    data: {
      show: newShow,
    },
  });
}

export async function updateCalendarColor(id: string, newColor: string) {
  const originColor = await prisma.calendar.findUnique({
    where: {
      id: id,
    },
    select: {
      defaultColor: true,
    },
  });

  if (!originColor) return { status: 500 };

  // update event color if the event color is the same as its calendar default color
  const updateEventColor = await prisma.event.updateMany({
    where: {
      calendarId: id,
      color: originColor.defaultColor,
    },
    data: {
      color: newColor,
    },
  });

  const updateCalendarColor = await prisma.calendar.update({
    where: {
      id: id,
    },
    data: {
      defaultColor: newColor,
    },
  });
}
