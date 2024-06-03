"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Montserrat } from "next/font/google";

import { isAfter } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";

import CalendarIcon from "../../../public/calendar-icon.png";
import CalendarPicker from "./CalendarPicker";
import ColorPicker from "./ColorPicker";
import DatePicker from "./DatePicker";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import NotesIcon from "../../../public/notes-icon.png";
import TimePicker from "./TimePicker";

import { isStartTimeBeforeEndTime } from "@/lib/functions";
import { updateEvent } from "@/app/editevent/[id]/action";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function EditEventForm({
  calendars,
  eventData,
}: {
  calendars: Calendar[];
  eventData: CalendarEvent;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik<CalendarEvent>({
    initialValues: {
      id: eventData.id,
      title: eventData.title,
      isAllDay: eventData.isAllDay,
      startDate: eventData.startDate,
      startTime: eventData.startTime,
      endDate: eventData.endDate,
      endTime: eventData.endTime,
      description: eventData.description,
      calendarId: eventData.calendarId,
      calendar: eventData.calendar,
      color: eventData.color,
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().max(100, "Title cannot exceed 100 characters."),
      isAllDay: Yup.boolean().required(),
      startDate: Yup.string().required(),
      startTime: Yup.string().required(),
      endDate: Yup.string().required(),
      endTime: Yup.string().required(),
      description: Yup.string().max(
        500,
        "Description cannot exceed 100 characters."
      ),
      calendarId: Yup.string().required(),
      color: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      const response = await updateEvent(values);
      if (response.status === 200) {
        router.push(`/month/${values.startDate.slice(0, -2)}01`);
        router.refresh();
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col justify-start items-start gap-10 px-6 py-6">
        <div className="flex flex-row justify-start items-center gap-6 w-4/5 max-w-4xl">
          <FontAwesomeIcon
            icon={faXmark}
            style={{
              height: "23px",
              color: "rgb(100 116 139)",
              cursor: "pointer",
            }}
            onClick={() => router.back()}
          />
          <input
            type="text"
            id="title"
            name="title"
            max={100}
            value={formik.values.title}
            onChange={formik.handleChange}
            placeholder="Add title"
            autoComplete="off"
            className={`h-10 w-full text-2xl border-b hover:bg-slate-100 focus:border-b-2 focus:border-blue-600 focus:outline-0 ${montserrat.className}`}
          />
          <button
            disabled={
              !(formik.isValid && formik.dirty) ||
              isAfter(
                new Date(formik.values.startDate),
                new Date(formik.values.endDate)
              ) ||
              (!formik.values.isAllDay &&
                !isStartTimeBeforeEndTime(
                  formik.values.startDate,
                  formik.values.endDate,
                  formik.values.startTime,
                  formik.values.endTime
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
        <div className="ml-12 flex flex-row items-center gap-3">
          <input
            type="checkbox"
            id="isAllDay"
            name="isAllDay"
            className="scale-150"
            checked={formik.values.isAllDay}
            onChange={formik.handleChange}
          />
          <label htmlFor="isAllDay" className="text-lg">
            All day
          </label>
        </div>
        <div className="ml-10 flex flex-row items-center gap-3">
          <div className="flex flex-col gap-3">
            <DatePicker
              field="startDate"
              value={formik.values.startDate}
              setFieldValue={formik.setFieldValue}
              error={false}
            />
            {!formik.values.isAllDay && (
              <TimePicker
                field="startTime"
                value={formik.values.startTime}
                setFieldValue={formik.setFieldValue}
                error={false}
              />
            )}
          </div>
          <div>&#8212;</div>
          <div className="flex flex-col gap-3">
            <DatePicker
              field="endDate"
              value={formik.values.endDate}
              setFieldValue={formik.setFieldValue}
              error={isAfter(
                new Date(formik.values.startDate),
                new Date(formik.values.endDate)
              )}
            />
            {!formik.values.isAllDay && (
              <TimePicker
                field="endTime"
                value={formik.values.endTime}
                setFieldValue={formik.setFieldValue}
                error={
                  !isStartTimeBeforeEndTime(
                    formik.values.startDate,
                    formik.values.endDate,
                    formik.values.startTime,
                    formik.values.endTime
                  )
                }
              />
            )}
          </div>
        </div>
        <div className="ml-1.5 flex flex-row items-center gap-3 w-4/5 max-w-4xl">
          <Image src={NotesIcon} alt="" width={20} height={20} />
          <input
            type="text"
            id="description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            autoComplete="off"
            placeholder="Add description"
            className="grow rounded bg-slate-100 mr-3 hover:bg-slate-200 h-10 px-3 text-sm focus:outline-0 focus:border-b-2 focus:border-blue-600"
          />
        </div>
        <div className="ml-1.5 flex flex-row items-center gap-3">
          <Image src={CalendarIcon} alt="" width={20} height={20} />
          <CalendarPicker
            field="calendarId"
            value={formik.values.calendarId}
            setFieldValue={formik.setFieldValue}
            calendars={calendars}
          />
          <ColorPicker
            value={formik.values.color}
            setColor={(color: string) =>
              formik.setFieldValue("color", color, true)
            }
          />
        </div>
      </div>
    </form>
  );
}
