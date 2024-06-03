import { prisma } from "../../../../prisma/prisma";

import SettingHeader from "@/components/headers/SettingsHeader";
import SettingsSideBar from "@/components/sidebars/SettingsSideBar";

import { getSession } from "@/lib/auth";

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  const calendars: Calendar[] = await prisma.calendar.findMany({
    where: {
      userId: session?.user?.id as string,
    },
    select: {
      id: true,
      name: true,
      defaultColor: true,
      show: true,
    },
  });

  return (
    <div className="flex flex-col">
      <SettingHeader />
      <div className="flex flex-row height-calendar gap-4 sm:gap-24">
        <SettingsSideBar calendars={calendars} />
        <div>{children}</div>
      </div>
    </div>
  );
}
