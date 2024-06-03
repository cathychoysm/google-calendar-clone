import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import useEventModalContext from "@/contexts/EventModalContext";
import useSnackBarContext from "@/contexts/SnackBarContext";

import CalendarIcon from "../../public/calendar-icon.png";
import DeleteIcon from "../../public/delete-icon.svg";
import EditIcon from "../../public/edit-icon.svg";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotesIcon from "../../public/notes-icon.png";

import { calendarColorOptions } from "@/lib/data";
import { deleteEvent } from "@/app/month/[month]/action";
import { ISODateToDisplayDate } from "@/lib/functions";

export default function EventModal() {
  const router = useRouter();

  const { isOpenEventModal, setIsOpenEventModal, event, position } =
    useEventModalContext();
  const { setIsOpenSnackBar } = useSnackBarContext();

  // Close form modal when clicking outside of the modal
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsOpenEventModal(false);
    }
  };

  useEffect(() => {
    if (isOpenEventModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenEventModal]);

  return (
    <>
      {isOpenEventModal && event && (
        <div
          ref={modalRef}
          className="z-50 absolute modal-transform w-450 bg-white rounded border border-slate-100 shadow-2xl flex flex-col gap-3 px-8 py-5"
          style={{ top: position.top, left: position.left }}
        >
          <div className="flex flex-row justify-end items-center gap-3">
            <Link href={`/editevent/${event.id}`}>
              <Image
                src={EditIcon}
                alt="Edit event"
                width={23}
                height={23}
                className="cursor-pointer"
              />
            </Link>
            <Image
              src={DeleteIcon}
              alt="Delete event"
              onClick={() => {
                setIsOpenSnackBar(true);
                deleteEvent(event.id);
                setIsOpenEventModal(false);
                router.refresh();
              }}
              width={23}
              height={23}
              className="cursor-pointer"
            />
            <FontAwesomeIcon
              icon={faXmark}
              style={{
                height: "20px",
                color: "rgb(100 116 139)",
                cursor: "pointer",
                paddingLeft: "3px",
              }}
              onClick={() => {
                setIsOpenEventModal(false);
              }}
            />
          </div>
          <div className="flex flex-col items-start gap-6">
            <div className="flex flex-row justify-start items-center gap-6">
              <div
                className="w-4 h-4 rounded m-0.5"
                style={{ backgroundColor: calendarColorOptions[event.color] }}
              />
              <div className="flex flex-col justify-start items-start gap-1">
                <h3 className="text-xl w-80 truncate">{event.title}</h3>
                {event.isAllDay &&
                event.startTime === "00:00" &&
                event.endTime === "00:00" ? (
                  <div className="text-sm">
                    {ISODateToDisplayDate(event.startDate)} -{" "}
                    {ISODateToDisplayDate(event.endDate)}
                  </div>
                ) : event.startDate === event.endDate ? (
                  <div className="text-sm">
                    {ISODateToDisplayDate(event.startDate)} {event.startTime} -{" "}
                    {event.endTime}
                  </div>
                ) : (
                  <div className="text-sm">
                    {ISODateToDisplayDate(event.startDate)} {event.startTime} -{" "}
                    {ISODateToDisplayDate(event.endDate)} {event.endTime}
                  </div>
                )}
              </div>
            </div>
            {event.description && (
              <div className="flex flex-row justify-start items-center gap-6">
                <Image src={NotesIcon} alt="" width={20} height={20} />
                <div className="w-80 truncate">{event.description}</div>
              </div>
            )}
            <div className="flex flex-row justify-start items-center gap-6">
              <Image src={CalendarIcon} alt="" width={20} height={20} />
              <div>{event.calendar}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
