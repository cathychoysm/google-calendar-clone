"use client";

import { Montserrat } from "next/font/google";

import { deleteCalendar } from "@/app/settings/calendar/action";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function DeleteCalendarModal({
  calendar,
  setIsOpen,
}: DeleteCalendarModalProps) {
  return (
    <div
      onClick={() => setIsOpen(false)}
      className="z-40 absolute top-0 left-0 w-screen h-screen flex justify-center items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
    >
      <div className="z-50 flex flex-col gap-5 bg-white rounded border border-slate-100 shadow-lg p-6">
        <div className="self-start">
          You are about to permanently delete {calendar.name}. Do you wish to
          continue?
        </div>
        <div className="self-end flex flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className={`flex justify-center items-center px-3 py-2 rounded border-2 border-slate-200 ${montserrat.className}`}
          >
            <div className="text-xs">Cancel</div>
          </button>
          <button
            type="button"
            onClick={() => deleteCalendar(calendar.id)}
            className={`flex justify-center items-center px-3 py-2 rounded bg-red-500 ${montserrat.className}`}
          >
            <div className="text-xs text-white">Permanently delete</div>
          </button>
        </div>
      </div>
    </div>
  );
}
