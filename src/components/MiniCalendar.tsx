"use client";

import { Montserrat } from "next/font/google";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { format, parse } from "date-fns";

import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { generateDateArrays, getNewMonthByInterval } from "@/lib/functions";

const daysOfWeek: string[] = ["M", "T", "W", "T", "F", "S", "S"];

const montserrat = Montserrat({ subsets: ["latin"] });

export default function MiniCalendar({ onClickDate }: MiniCalendarProps) {
  const pathname = usePathname();
  const pathMonth = pathname.substring(pathname.length - 10);

  const [month, setMonth] = useState<string>(pathMonth);
  const [dates, setDates] = useState<string[]>([]);
  const [weeks, setWeeks] = useState<number[]>([]);

  useEffect(() => {
    const { dates, weeks } = generateDateArrays(month);
    setDates(dates);
    setWeeks(weeks);
  }, [month]);

  const setPrevMonth = () => {
    const newMonth = getNewMonthByInterval(month, -1);
    setMonth(newMonth);
  };

  const setNextMonth = () => {
    const newMonth = getNewMonthByInterval(month, 1);
    setMonth(newMonth);
  };

  return (
    <div className="flex flex-col sm:m-2 gap-3 w-28 sm:w-52 sm:h-52">
      <div className="flex flex-row justify-between items-center">
        <div
          className={`text-xs sm:text-sm text-extrabold text-slate-700 ${montserrat.className}`}
        >
          {format(parse(month, "yyyy-MM-dd", new Date()), "MMMM yyyy")}
        </div>
        <div className="flex flex-row gap-5">
          <FontAwesomeIcon
            icon={faChevronLeft}
            style={{ height: "10px", color: "#5F6368", cursor: "pointer" }}
            onClick={setPrevMonth}
          />
          <FontAwesomeIcon
            icon={faChevronRight}
            style={{ height: "10px", color: "#5F6368", cursor: "pointer" }}
            onClick={setNextMonth}
          />
        </div>
      </div>
      <div className="grow flex flex-row sm:gap-2">
        <div className="flex flex-col items-center">
          <div className="w-2 sm:w-5 h-2 sm:h-5"></div>
          {weeks.map((week) => {
            return (
              <div
                key={week}
                className="grow flex justify-center items-center bg-slate-100 font-mini-calendar w-3 sm:w-5 sm:h-7 text-center pt-1"
              >
                <div>{week}</div>
              </div>
            );
          })}
        </div>
        <div className="grow flex flex-col">
          <div className="flex flex-row">
            {daysOfWeek.map((day, index) => {
              return (
                <div
                  key={index}
                  className="grow text-center font-mini-calendar h-2 sm:h-5"
                >
                  {day}
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-7 grid-rows-6 h-full">
            {dates.map((date) => {
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => onClickDate(date)}
                  className={`flex justify-center items-center w-4 sm:w-6 h-4 sm:h-6 mt-1 rounded-full ${
                    date === format(new Date(), "yyyy-MM-dd")
                      ? "bg-blue-600"
                      : "hover:bg-blue-300"
                  }`}
                >
                  <div
                    className={`font-mini-calendar text-center ${
                      date === format(new Date(), "yyyy-MM-dd")
                        ? "text-white font-bold"
                        : ""
                    } ${
                      Number(date.substring(5, 7)) !==
                      Number(month.substring(5, 7))
                        ? "text-slate-400"
                        : ""
                    }`}
                  >
                    {Number(date.slice(-2))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
