"use client";

import { useEffect, useRef } from "react";
import useCreateEventModalContext from "../../contexts/CreateEventModalContext";

import Draggable from "react-draggable";
import { addHours, format, isAfter, parse } from "date-fns";
import { useFormikContext } from "formik";

import { Montserrat } from "next/font/google";

import CalendarIcon from "../../../public/calendar-icon.png";
import CalendarPicker from "./CalendarPicker";
import ColorPicker from "./ColorPicker";
import DatePicker from "./DatePicker";
import DragIcon from "../../../public/drag-icon.png";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import NotesIcon from "../../../public/notes-icon.png";
import TimePicker from "./TimePicker";

import { isStartTimeBeforeEndTime } from "@/lib/functions";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function CreateEventForm({
  calendars,
  loading,
}: CreateEventFormProps) {
  const { isOpenModal, setIsOpenModal } = useCreateEventModalContext();

  const { values, isValid, dirty, setFieldValue, handleChange, resetForm } =
    useFormikContext<CreateEventFormFormikValues>();

  // Close form modal when clicking outside of the modal
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsOpenModal(false);
    }
  };

  useEffect(() => {
    if (isOpenModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenModal]);

  return (
    <>
      {isOpenModal && (
        <Draggable handle=".handle" nodeRef={modalRef}>
          <div
            ref={modalRef}
            className="modal-transform z-50 absolute top-1/3 left-modal bg-white shadow-xl rounded flex flex-col pb-2"
          >
            <div className="handle bg-slate-100 h-10 rounded-t flex flex-row justify-between items-center px-4 cursor-move">
              <Image src={DragIcon} alt="Drag" width={23} height={23} />
              <FontAwesomeIcon
                icon={faXmark}
                style={{
                  height: "18px",
                  color: "rgb(100 116 139)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsOpenModal(false);
                  resetForm();
                }}
              />
            </div>
            <div className="p-3 flex flex-col gap-8 items-start">
              <input
                type="text"
                id="title"
                name="title"
                max={100}
                value={values.title}
                onChange={handleChange}
                placeholder="Add title and time"
                autoComplete="off"
                className={`ml-10 h-10 w-5/6 text-xl border-b hover:bg-slate-100 focus:border-b-2 focus:border-blue-600 focus:outline-0 ${montserrat.className}`}
              />
              <div className="ml-10 flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  id="isAllDay"
                  name="isAllDay"
                  className="scale-150"
                  checked={values.isAllDay}
                  onChange={handleChange}
                />
                <label htmlFor="isAllDay" className="text-lg">
                  All day
                </label>
              </div>
              <div className="ml-1.5 flex flex-row items-center gap-3">
                <FontAwesomeIcon
                  icon={faClock}
                  style={{
                    height: "18px",
                    color: "rgb(100 116 139)",
                  }}
                />
                <div className="flex flex-col gap-3">
                  <DatePicker
                    value={values.startDate}
                    onClick={(value: string) => {
                      setFieldValue("startDate", value, true);
                      if (isAfter(new Date(value), new Date(values.endDate))) {
                        setFieldValue("endDate", value, true);
                      }
                    }}
                    error={false}
                  />
                  {!values.isAllDay && (
                    <TimePicker
                      value={values.startTime}
                      onClick={(value: string) => {
                        setFieldValue("startTime", value, true);
                        if (
                          !isStartTimeBeforeEndTime(
                            values.startDate,
                            values.endDate,
                            value,
                            values.endTime
                          )
                        ) {
                          setFieldValue(
                            "endTime",
                            format(
                              addHours(parse(value, "HH:mm", new Date()), 1),
                              "HH:mm"
                            ),
                            true
                          );
                        }
                      }}
                      error={false}
                    />
                  )}
                </div>
                <div>&#8212;</div>
                <div className="flex flex-col gap-3">
                  <DatePicker
                    value={values.endDate}
                    onClick={(value: string) =>
                      setFieldValue("endDate", value, true)
                    }
                    error={isAfter(
                      new Date(values.startDate),
                      new Date(values.endDate)
                    )}
                  />
                  {!values.isAllDay && (
                    <TimePicker
                      value={values.endTime}
                      onClick={(value: string) =>
                        setFieldValue("endTime", value, true)
                      }
                      error={
                        !isStartTimeBeforeEndTime(
                          values.startDate,
                          values.endDate,
                          values.startTime,
                          values.endTime
                        )
                      }
                    />
                  )}
                </div>
              </div>
              <div className="ml-1.5 flex flex-row items-center gap-3 w-full">
                <Image src={NotesIcon} alt="" width={20} height={20} />
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  autoComplete="off"
                  placeholder="Add description"
                  className="grow rounded bg-slate-100 mr-3 hover:bg-slate-200 h-10 px-3 text-sm focus:outline-0 focus:border-b-2 focus:border-blue-600"
                />
              </div>
              <div className="ml-1.5 flex flex-row items-center gap-3 w-full">
                <Image src={CalendarIcon} alt="" width={20} height={20} />
                <CalendarPicker
                  value={values.calendarId}
                  onClick={(value: Calendar) => {
                    setFieldValue("calendarId", value.id, true);
                    setFieldValue("color", value.defaultColor, true);
                  }}
                  calendars={calendars}
                />
                <ColorPicker
                  value={values.color}
                  setColor={(color: string) =>
                    setFieldValue("color", color, true)
                  }
                />
              </div>
              <button
                disabled={
                  !(isValid && dirty) ||
                  isAfter(
                    new Date(values.startDate),
                    new Date(values.endDate)
                  ) ||
                  (!values.isAllDay &&
                    !isStartTimeBeforeEndTime(
                      values.startDate,
                      values.endDate,
                      values.startTime,
                      values.endTime
                    )) ||
                  loading
                }
                type="submit"
                className="self-end mx-5 px-4 py-2 rounded bg-blue-500 text-white disabled:bg-blue-300"
              >
                {loading ? (
                  <svg
                    className="animate-spin mx-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <div className="text-white text-sm">Save</div>
                )}
              </button>
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
}
