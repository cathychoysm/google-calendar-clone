import EditCalendarForm from "@/components/forms/EditCalendarForm";

import { getCalendar } from "../action";

export default async function Page({
  params,
}: {
  params: { calendarId: string };
}) {
  const calendar = await getCalendar(params.calendarId);

  return <EditCalendarForm calendar={calendar} />;
}
