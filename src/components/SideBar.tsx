import { Montserrat } from "next/font/google";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const daysOfWeek: string[] = ["M", "T", "W", "T", "F", "S", "S"];
const weekRows: number[] = [1, 2, 3, 4, 5];
const tempDateArray = Array.from({ length: 35 }, (_, index) => index + 1);

const montserrat = Montserrat({ subsets: ["latin"] });

export default function SideBar() {
  return (
    <div className="flex flex-col justify-start height-calendar w-64 pt-4 px-4 gap-3">
      <button
        className={`rounded-full shadow-button h-12 w-40 px-3 flex flex-row justify-start gap-4 items-center ${montserrat.className}`}
      >
        <svg width="36" height="36" viewBox="0 0 36 36">
          <path fill="#34A853" d="M16 16v14h4V20z"></path>
          <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
          <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
          <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
          <path fill="none" d="M0 0h36v36H0z"></path>
        </svg>
        <div className="text-slate-600">Create</div>
      </button>

      <div className="flex flex-col m-2 gap-3">
        <div className="flex flex-row justify-between items-center">
          <div className={`text-sm text-slate-600 ${montserrat.className}`}>
            May 2024
          </div>
          <div className="flex flex-row gap-5">
            <FontAwesomeIcon
              icon={faChevronLeft}
              style={{ height: "10px", color: "#5F6368", cursor: "pointer" }}
            />
            <FontAwesomeIcon
              icon={faChevronRight}
              style={{ height: "10px", color: "#5F6368", cursor: "pointer" }}
            />
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex flex-col items-center">
            <div className="w-5 h-5"></div>
            {weekRows.map((week) => {
              return (
                <div
                  key={week}
                  className="grow bg-slate-100 font-mini-calendar w-5 h-7 text-slate-600 text-center pt-1"
                >
                  {week}
                </div>
              );
            })}
          </div>
          <div className="grow flex flex-col">
            <div className="flex flex-row">
              {daysOfWeek.map((day) => {
                return (
                  <div
                    key={day}
                    className="grow text-center font-mini-calendar h-5"
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 h-full">
              {tempDateArray.map((date) => {
                return (
                  <div
                    key={date}
                    className="font-mini-calendar h-7 text-slate-600 text-center pt-1"
                  >
                    {date}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <input
        type="text"
        id="search_people"
        placeholder="Search for people"
        className="rounded bg-slate-100 hover:bg-slate-200 h-10 px-3 text-sm text-slate-600 focus:outline-0 focus:border-b-2 focus:border-blue-600"
      />
      <div className={`text-slate-600 text-sm m-2 ${montserrat.className}`}>
        My calendars
      </div>
      <div className="grow flex items-end">
        <a
          href="https://www.google.com/intl/en-GB/policies/privacy/"
          target="_blank"
          className={`text-slate-600 text-xs m-2 ${montserrat.className}`}
        >
          Terms - Privacy
        </a>
      </div>
    </div>
  );
}
