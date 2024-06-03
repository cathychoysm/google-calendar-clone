"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useFormik } from "formik";
import * as Yup from "yup";

import { Montserrat } from "next/font/google";

import DeleteCalendarModal from "../DeleteCalendarModal";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Palette from "./Palette";
import { TextField } from "@mui/material";

import { calendarColorOptions } from "@/lib/data";
import { updateCalendar } from "@/app/settings/calendar/action";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function EditCalendarForm({ calendar }: { calendar: Calendar }) {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenPalette, setIsOpenPalette] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);

  // Close palette popper when clicking outside of the popper
  const paletteRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      paletteRef.current &&
      !paletteRef.current.contains(event.target as Node)
    ) {
      setIsOpenPalette(false);
    }
  };

  useEffect(() => {
    if (isOpenPalette) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenPalette]);

  const formik = useFormik({
    initialValues: {
      id: calendar.id,
      name: calendar.name,
      defaultColor: calendar.defaultColor,
      show: calendar.show,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .trim()
        .max(254, "Name cannot exceed 254 characters.")
        .required("Name is required."),
      defaultColor: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      const response = await updateCalendar(values);
      if (response.status === 200) {
        router.refresh();
        setLoading(false);
      } else {
        setLoading(false);
        console.error("Invalid values");
      }
    },
  });

  return (
    <div className="flex flex-col gap-12">
      <form
        onSubmit={formik.handleSubmit}
        className="my-6 flex flex-col justify-start gap-8"
      >
        <h2 className={`text-slate-500 sm:text-lg ${montserrat.className}`}>
          Calendar settings
        </h2>
        <div className="flex flex-col gap-1 items-start">
          <TextField
            variant="filled"
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={Boolean(formik.errors.name) && formik.touched.name}
            helperText={
              formik.errors.name && formik.touched.name
                ? formik.errors.name
                : ""
            }
            autoComplete="off"
            InputLabelProps={{
              required: false,
              sx: {
                fontSize: "14px",
                paddingX: "6px",
              },
            }}
            InputProps={{
              sx: {
                backgroundColor: "rgb(241 245 249)",
                paddingX: "6px",
                "&:hover": {
                  backgroundColor: "rgb(226 232 240)",
                },
              },
            }}
            sx={{ width: { xs: "200px", sm: "300px" } }}
          />
        </div>
        <button
          type="button"
          onClick={() => setIsOpenPalette(!isOpenPalette)}
          className="flex flex-row items-center justify-between gap-3 w-52 sm:w-auto bg-slate-100 rounded p-4 hover:bg-slate-200"
        >
          <div className="flex flex-row items-center gap-5">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  calendarColorOptions[formik.values.defaultColor],
              }}
            ></div>
            <div className="text-slate-500 text-sm">
              {formik.values.defaultColor}
            </div>
          </div>
          <FontAwesomeIcon
            icon={faChevronDown}
            style={{ height: "15px", color: "#5F6368" }}
          />
        </button>
        {isOpenPalette && (
          <div
            ref={paletteRef}
            className="absolute translate-y-52 translate-x-28 rounded bg-white border border-slate-100 shadow-lg"
          >
            <Palette
              setIsOpenPalette={setIsOpenPalette}
              color={formik.values.defaultColor}
              setColor={(color: string) => (formik.values.defaultColor = color)}
            />
          </div>
        )}
        <button
          type="submit"
          disabled={!(formik.isValid && formik.dirty) || loading}
          className={`flex justify-center items-center w-40 py-2 rounded bg-blue-500 ${montserrat.className}`}
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
            <div className="text-white text-sm">Save changes</div>
          )}
        </button>
      </form>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className={`text-slate-500 text-lg ${montserrat.className}`}>
            Remove calendar
          </h2>
          <div className="text-slate-500 text-sm">
            All events in this calendar will be deleted.
          </div>
        </div>
        <button
          onClick={() => setIsOpenDelete(true)}
          className={`flex justify-center items-center w-40 py-2 rounded border-2 border-slate-200 ${montserrat.className}`}
        >
          <div className="text-sm">Delete calendar</div>
        </button>
        {isOpenDelete && (
          <DeleteCalendarModal
            calendar={calendar}
            setIsOpen={setIsOpenDelete}
          />
        )}
      </div>
    </div>
  );
}
