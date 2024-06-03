import MainBody from "@/components/MainBody";
import MainHeader from "@/components/headers/MainHeader";

import { getCalendars, getDatesWithEvents } from "./action";
import { loginIsRequiredServer } from "@/lib/auth";
import { CreateEventModalContextProvider } from "@/contexts/CreateEventModalContext";
import { SnackBarContextProvider } from "@/contexts/SnackBarContext";

export default async function Page({ params }: { params: { month: string } }) {
  await loginIsRequiredServer();

  const calendars = await getCalendars();
  const datesWithEvents = await getDatesWithEvents(params.month);

  return (
    <div>
      <CreateEventModalContextProvider>
        <SnackBarContextProvider>
          <MainHeader />
          <MainBody calendars={calendars} datesWithEvents={datesWithEvents} />
        </SnackBarContextProvider>
      </CreateEventModalContextProvider>
    </div>
  );
}
