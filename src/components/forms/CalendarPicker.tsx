"use client";

import { useEffect, useRef, useState } from "react";

import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DateTimePickerProps } from "./DatePicker";

interface CalendarPickerProps extends DateTimePickerProps {
  calendars: Calendar[];
}

export default function CalendarPicker({
  field,
  value,
  setFieldValue,
  calendars,
}: CalendarPickerProps) {
  const [isListOpen, setIsListOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

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
    <div className="flex flex-row items-center justify-between pr-3 py-2 w-44 text-sm rounded bg-slate-100 mr-3 hover:bg-slate-200">
      <div
        ref={inputRef}
        onClick={() => setIsListOpen(true)}
        className="bg-transparent w-full px-3 truncate focus:outline-0"
      >
        {calendars.find((calendar) => calendar.id === value)?.name}
      </div>
      <FontAwesomeIcon
        icon={faCaretDown}
        onClick={() => setIsListOpen(true)}
        style={{ width: 15, height: 15 }}
      />
      {isListOpen && (
        <div
          ref={listRef}
          className="z-50 absolute flex flex-col rounded shadow-lg border border-slate-100 bg-white divide-y divide-slate-100 w-44 h-44 translate-y-28 overflow-x-hidden overflow-y-auto"
        >
          {calendars.map((calendar) => {
            return (
              <div
                key={calendar.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setFieldValue(field, calendar.id, true);
                  setFieldValue("color", calendar.defaultColor, true);
                  setIsListOpen(false);
                }}
                className="p-3 text-sm w-44 truncate"
              >
                {calendar.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
