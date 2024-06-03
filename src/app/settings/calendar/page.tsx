import { LastVisitedMonthContextProvider } from "@/contexts/lastVisitedMonthContext";

import CreateCalendarForm from "@/components/forms/CreateCalendarForm";

import { loginIsRequiredServer } from "@/lib/auth";

export default async function Page() {
  await loginIsRequiredServer();

  return (
    <LastVisitedMonthContextProvider>
      <CreateCalendarForm />
    </LastVisitedMonthContextProvider>
  );
}
