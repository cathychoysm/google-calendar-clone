"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { calendarColorOptions } from "@/lib/data";

export default function SettingsSideBar({ calendars }: SideBarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-8 w-32 sm:w-64 pt-4 pr-4 overflow-hidden hover:overflow-y-auto text-slate-500">
      <Link
        href="/settings/calendar"
        className={`w-28 sm:w-56 pl-3 sm:pl-6 py-3 rounded-r-full hover:bg-slate-100 ${
          pathname === "/settings/calendar"
            ? "text-xs sm:text-sm bg-blue-100 text-blue-600 font-bold"
            : ""
        }`}
      >
        Add calendar
      </Link>
      <div className="flex flex-col gap-3">
        <h3 className="pl-3 sm:pl-6 py-3 text-xs sm:text-sm text-slate-600 font-bold">
          Setting for my calendars
        </h3>
        {calendars &&
          calendars.map((calendar) => {
            return (
              <Link
                key={calendar.id}
                href={`/settings/calendar/${calendar.id}`}
                className={`w-28 sm:w-56 pl-3 sm:pl-6 py-3 rounded-r-full hover:bg-slate-100 flex flex-row gap-3 items-center justify-start ${
                  new RegExp(calendar.id).test(pathname)
                    ? "bg-blue-100 text-blue-600 font-bold"
                    : ""
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      calendarColorOptions[calendar.defaultColor],
                  }}
                />
                <div
                  className="text-xs sm:text-sm w-16 sm:w-40 truncate"
                  title={calendar.name}
                >
                  {calendar.name}
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
