"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { DateTimePickerProps } from "./DatePicker";
import { TextField } from "@mui/material";

export default function TimePicker({
  field,
  value,
  setFieldValue,
  error,
}: DateTimePickerProps) {
  const times = useMemo(() => {
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const paddedHour = hour.toString().padStart(2, "0");
        const paddedMinute = minute.toString().padStart(2, "0");
        times.push(`${paddedHour}:${paddedMinute}`);
      }
    }
    return times;
  }, []);

  const [isListOpen, setIsListOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      if (
        listRef.current &&
        document.activeElement &&
        !listRef.current.contains(document.activeElement) &&
        inputRef.current !== document.activeElement
      ) {
        setIsListOpen(false);
      }
    }, 0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        listRef.current &&
        inputRef.current &&
        !listRef.current.contains(event.target as Node) &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsListOpen(false);
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
        value={value}
        onClick={() => setIsListOpen(true)}
        onBlur={handleBlur}
        InputProps={{
          sx: {
            fontSize: 13,
            color: "rgb(71 85 105)",
            width: 160,
          },
        }}
      />
      {isListOpen && (
        <div
          ref={listRef}
          className="z-50 absolute flex flex-col rounded shadow-lg border border-slate-100 bg-white divide-y divide-slate-100 w-40 h-44 overflow-y-auto"
        >
          {times.map((time) => {
            return (
              <div
                key={time}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setFieldValue(field, time, true);
                  setIsListOpen(false);
                }}
                className="p-3 text-sm"
              >
                {time}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
