"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";

import useCreateEventModalContext from "../contexts/CreateEventModalContext";
import useEventModalContext from "@/contexts/EventModalContext";

import { format } from "date-fns";
import { useFormikContext } from "formik";

import EventModal from "./EventModal";

import { calendarColorOptions, daysOfWeek, monthName } from "@/lib/data";
import { generateDateArrays } from "@/lib/functions";

export default function MainCalendar({ datesWithEvents }: CalendarProps) {
  const pathname = usePathname();
  const pathMonth = pathname.substring(pathname.length - 10);

  const calendarRef = useRef<HTMLDivElement>(null);

  const { setIsOpenModal } = useCreateEventModalContext();
  const { setIsOpenEventModal, setEvent, setPosition } = useEventModalContext();

  const { setFieldValue } = useFormikContext();

  const { weeks } = generateDateArrays(pathMonth);

  const handleDateBoxClick = (date: string) => {
    setFieldValue("startDate", date, true);
    setFieldValue("endDate", date, true);
    setIsOpenModal(true);
  };

  const handleEventClick = (
    e: React.MouseEvent<HTMLDivElement>,
    newEvent: CalendarEvent
  ) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const calendarRect = calendarRef.current!.getBoundingClientRect();

    const top =
      rect.top + 250 > calendarRect.bottom ? rect.top - 180 : rect.bottom;
    const left =
      rect.left + 600 > calendarRect.right ? rect.left - 450 : rect.left + 130;

    setEvent(newEvent);
    setPosition({ top: top, left: left });
    setIsOpenEventModal(true);
  };

  return (
    <>
      <div
        ref={calendarRef}
        className="flex flex-row width-calendar height-calendar py-3"
      >
        <div className="flex flex-col">
          <div className="bg-slate-100 h-5 w-6"></div>
          {weeks.map((week) => {
            return (
              <div
                key={week}
                className="grow bg-slate-100 w-6 text-center text-xs border-b border-b-slate-300 pt-2"
              >
                {week}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-row h-5">
            {daysOfWeek.map((day) => {
              return (
                <div
                  key={day}
                  className="basis-0 grow text-center text-xs border-r border-r-slate-300 pt-2"
                >
                  {day}
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-7 grid-rows-6 h-full">
            {datesWithEvents.map((date) => {
              return (
                <div
                  key={date.date}
                  onClick={(e) => handleDateBoxClick(date.date)}
                  className="border-b border-b-slate-300 border-r border-r-slate-300 pt-2 flex flex-col"
                >
                  <div
                    className={`${
                      date.date === format(new Date(), "yyyy-MM-dd")
                        ? "bg-blue-600"
                        : "hover:bg-blue-300"
                    } self-center flex items-center justify-center w-7 h-7 rounded-full mb-3`}
                  >
                    <div
                      className={`text-center text-xs ${
                        date.date === format(new Date(), "yyyy-MM-dd")
                          ? "text-white font-bold"
                          : ""
                      } ${
                        Number(date.date.substring(5, 7)) !==
                        Number(pathMonth.substring(5, 7))
                          ? "text-slate-400"
                          : ""
                      }`}
                    >
                      {Number(date.date.slice(-2))}{" "}
                      {date.date.slice(-2) === "01" &&
                        date.date !== format(new Date(), "yyyy-MM-dd") &&
                        monthName[Number(date.date.substring(5, 7)) - 1]}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 items-start overflow-hidden grow shrink basis-3">
                    {date.events.map((event) => {
                      if (event.show) {
                        if (event.isAllDay) {
                          return (
                            <div
                              key={event.id}
                              onClick={(e) => handleEventClick(e, event)}
                              className="z-40 cursor-pointer px-2.5 py-0.5 w-11/12 rounded"
                              style={{
                                backgroundColor:
                                  calendarColorOptions[event.color],
                              }}
                            >
                              <div className="text-xs text-white text-nowrap overflow-hidden">
                                {event.title}
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              key={event.id}
                              onClick={(e) => handleEventClick(e, event)}
                              className="z-40 cursor-pointer flex flex-row items-center px-2 py-0.5 w-11/12"
                            >
                              <div
                                className="shrink-0 w-2 h-2 rounded-full mr-1.5"
                                style={{
                                  backgroundColor:
                                    calendarColorOptions[event.color],
                                }}
                              ></div>
                              <div className="text-xs text-nowrap overflow-hidden">
                                {event.startTime} {event.title}
                              </div>
                            </div>
                          );
                        }
                      }
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <EventModal />
      </div>
    </>
  );
}
