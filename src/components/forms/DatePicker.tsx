"use client";

import { useEffect, useRef, useState } from "react";

import { FormikErrors } from "formik";

import MiniCalendar from "../MiniCalendar";
import { TextField } from "@mui/material";

import { ISODateToDisplayDate } from "@/lib/functions";

export type DateTimePickerProps = {
  field: string;
  value: string;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<CreateEventFormFormikValues>>;
  error?: boolean;
};

export default function DatePicker({
  field,
  value,
  setFieldValue,
  error,
}: DateTimePickerProps) {
  const thisYear = new Date().getFullYear();

  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      if (
        calendarRef.current &&
        document.activeElement &&
        !calendarRef.current.contains(document.activeElement) &&
        inputRef.current !== document.activeElement
      ) {
        setIsOpenCalendar(false);
      }
    }, 0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        inputRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpenCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <TextField
        ref={inputRef}
        type="text"
        error={error}
        value={ISODateToDisplayDate(value)}
        onFocus={() => setIsOpenCalendar(true)}
        onBlur={handleBlur}
        InputProps={{
          sx: {
            fontSize: 13,
            color: "rgb(71 85 105)",
            width: 160,
          },
        }}
      />
      {isOpenCalendar && (
        <div
          ref={calendarRef}
          className="z-50 absolute bg-white rounded m-3 p-3 shadow-md border border-slate-100"
        >
          <MiniCalendar
            onClickDate={(date: string) => {
              setFieldValue(field, date, true);
              setIsOpenCalendar(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
