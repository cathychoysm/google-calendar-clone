"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { EventModalContextProvider } from "@/contexts/EventModalContext";
import useCreateEventModalContext from "@/contexts/CreateEventModalContext";
import useSnackBarContext from "@/contexts/SnackBarContext";

import { add, format } from "date-fns";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import CreateEventForm from "./forms/CreateEventForm";
import MainCalendar from "./MainCalendar";
import MainSideBar from "./sidebars/MainSideBar";

import { createEvent } from "@/app/month/[month]/action";

export default function MainBody({
  calendars,
  datesWithEvents,
}: MainBodyProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { setIsOpenModal } = useCreateEventModalContext();
  const { setIsOpenSnackBar } = useSnackBarContext();
  const [loading, setLoading] = useState(false);

  const now = new Date();

  return (
    <main>
      <EventModalContextProvider>
        <Formik
          initialValues={{
            title: "",
            isAllDay: true,
            startDate: "",
            startTime: format(add(now, { hours: 1 }), "HH:ss"),
            endDate: "",
            endTime: format(add(now, { hours: 2 }), "HH:ss"),
            description: "",
            calendarId: calendars[0].id,
            color: calendars[0].defaultColor,
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().max(100, ""),
            isAllDay: Yup.boolean().required(),
            startDate: Yup.string().required(),
            startTime: Yup.string().required(),
            endDate: Yup.string().required(),
            endTime: Yup.string().required(),
            description: Yup.string().max(500, ""),
            calendarId: Yup.string().required(),
            color: Yup.string().required(),
          })}
          onSubmit={async (values, action) => {
            console.log("start");
            setLoading(true);

            const response = await createEvent(values);

            setLoading(false);
            if (response.status === 500) {
              console.error("Invalid values");
            } else {
              action.resetForm();
              setIsOpenSnackBar(true);
              setIsOpenModal(false);
              if (pathname === `/month/${values.startDate.slice(0, -2)}01`) {
                router.refresh();
              } else {
                router.push(`/month/${values.startDate.slice(0, -2)}01`);
              }
            }
          }}
        >
          <Form className="flex flex-row">
            <MainSideBar calendars={calendars} />
            <MainCalendar datesWithEvents={datesWithEvents} />
            <CreateEventForm calendars={calendars} loading={loading} />
          </Form>
        </Formik>
      </EventModalContextProvider>
    </main>
  );
}
