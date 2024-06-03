"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import useCreateEventModalContext from "../../contexts/CreateEventModalContext";
import useLastVisitedMonthContext from "@/contexts/lastVisitedMonthContext";
import useSnackBarContext from "@/contexts/SnackBarContext";

import { format } from "date-fns";
import { Montserrat } from "next/font/google";
import { useFormikContext } from "formik";

import CheckIcon from "../../../public/check-icon.png";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MiniCalendar from "../MiniCalendar";
import PlusIcon from "../../../public/plus-icon.png";
import { Snackbar } from "@mui/material";

import { calendarColorOptions } from "@/lib/data";
import CalendarDropDownOptions from "../CalendarDropDownOptions";
import { toggleCalendar } from "@/app/month/[month]/action";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function MainSideBar({ calendars }: SideBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const pathMonth = pathname.substring(pathname.length - 10);
  const { setLastVisitedMonth } = useLastVisitedMonthContext();

  const { setIsOpenModal } = useCreateEventModalContext();
  const { setFieldValue } = useFormikContext();

  const [isOpenDropDown, setIsOpenDropDown] = useState<boolean>(false);
  const [calendar, setCalendar] = useState<Calendar>(calendars[0]);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });

  const { isOpenSnackBar, setIsOpenSnackBar } = useSnackBarContext();

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setIsOpenSnackBar(false);
  };

  const handleOpenDropDown = (
    event: React.MouseEvent<HTMLButtonElement>,
    newCalendar: Calendar
  ) => {
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();

    const top = rect.bottom;
    const left = rect.left;

    setCalendar(newCalendar);
    setPosition({ top: top, left: left });
    setIsOpenDropDown(true);
  };

  // Close form modal when clicking outside of the modal
  const dropDownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropDownRef.current &&
      !dropDownRef.current.contains(event.target as Node)
    ) {
      setIsOpenDropDown(false);
    }
  };

  useEffect(() => {
    if (isOpenDropDown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenDropDown]);

  return (
    <div className="flex flex-col justify-start overflow-hidden hover:overflow-y-auto w-32 sm:w-64 pt-4 mx-4 gap-6">
      <button
        type="button"
        className={`rounded-full shadow-button h-8 sm:h-12 w-20 sm:w-40 px-2 sm:px-3 flex flex-row justify-start gap-2 sm:gap-4 items-center ${montserrat.className}`}
        onClick={() => {
          setFieldValue("startDate", format(new Date(), "yyyy-MM-dd"), true);
          setFieldValue("endDate", format(new Date(), "yyyy-MM-dd"), true);
          setIsOpenModal(true);
        }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36">
          <path fill="#34A853" d="M16 16v14h4V20z"></path>
          <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
          <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
          <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
          <path fill="none" d="M0 0h36v36H0z"></path>
        </svg>
        <div className="text-xs sm:text-lg">Create</div>
      </button>

      <MiniCalendar
        onClickDate={(date) => {
          router.push(`/month/${date.substring(0, date.length - 2)}01`);
        }}
      />

      <div className="flex flex-col sm:m-2 items-start gap-1">
        <div className="flex flex-row items-center justify-between w-full sm:mb-3">
          <div className={`text-xs sm:text-sm ${montserrat.className}`}>
            My calendars
          </div>
          <Link
            href="/settings/calendar"
            onClick={() => setLastVisitedMonth(pathMonth)}
          >
            <Image
              src={PlusIcon}
              alt="Add new calendar"
              height={20}
              width={20}
              className="cursor-pointer"
            />
          </Link>
        </div>
        {calendars &&
          calendars.map((calendar) => {
            return (
              <div
                key={calendar.id}
                className="hover-item hover:bg-slate-100 flex flex-row justify-between items-center w-36 sm:w-64 pl-6 pr-8 sm:py-2 -mx-6"
              >
                <label className="flex flex-row items-center justify-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={calendar.show}
                    onChange={async () => {
                      setIsOpenSnackBar(true);
                      toggleCalendar(calendar.id, !calendar.show);
                      router.refresh();
                    }}
                    className="absolute h-0 w-0"
                  />
                  <span
                    className="absolute h-3 sm:h-5 w-3 sm:w-5 flex justify-center items-center"
                    style={
                      calendar.show
                        ? {
                            backgroundColor:
                              calendarColorOptions[calendar.defaultColor],
                            borderRadius: "2px",
                          }
                        : {
                            border: `solid 2px ${
                              calendarColorOptions[calendar.defaultColor]
                            }`,
                            borderRadius: "2px",
                          }
                    }
                  >
                    {calendar.show && (
                      <Image src={CheckIcon} alt="" height={20} width={20} />
                    )}
                  </span>
                  <div
                    className="ml-4 sm:ml-8 text-xs sm:text-sm w-24 sm:w-44 hover-truncate truncate"
                    title={calendar.name}
                  >
                    {calendar.name}
                  </div>
                </label>
                <button
                  type="button"
                  onClick={(event) => handleOpenDropDown(event, calendar)}
                  className="flex justify-center items-center px-3"
                >
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    style={{ height: "16px" }}
                    className="hover-shown"
                  />
                </button>
              </div>
            );
          })}
        {isOpenDropDown && (
          <div ref={dropDownRef} className="absolute" style={position}>
            <CalendarDropDownOptions
              calendar={calendar}
              setIsOpen={setIsOpenDropDown}
            />
          </div>
        )}
        <Snackbar
          open={isOpenSnackBar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleClose}
          autoHideDuration={3000}
          message="Updating..."
        />
      </div>
      <div className="grow flex items-end">
        <a
          href="https://www.google.com/intl/en-GB/policies/privacy/"
          target="_blank"
          className={`text-xs m-2 ${montserrat.className}`}
        >
          Terms - Privacy
        </a>
      </div>
    </div>
  );
}
