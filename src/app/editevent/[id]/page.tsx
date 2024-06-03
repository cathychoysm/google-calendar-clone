import EditEventForm from "@/components/forms/EditEventForm";

import { getEventData } from "./action";
import { getCalendars } from "@/app/month/[month]/action";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const calendars = await getCalendars();
  const eventData = await getEventData(id);

  return <EditEventForm calendars={calendars} eventData={eventData} />;
}
