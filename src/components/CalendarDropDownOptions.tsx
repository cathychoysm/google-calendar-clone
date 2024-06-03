import Link from "next/link";
import { useRouter } from "next/navigation";

import Palette from "./forms/Palette";

import { updateCalendarColor } from "@/app/month/[month]/action";
import useSnackBarContext from "@/contexts/SnackBarContext";

export default function CalendarDropDownOptions({
  calendar,
  setIsOpen,
}: CalendarDropDownOptionsProps) {
  const router = useRouter();

  const { setIsOpenSnackBar } = useSnackBarContext();

  return (
    <div className="bg-white rounded-md border-2 border-slate-100 shadow-xl flex flex-col items-start">
      <Link
        href={`/settings/calendar/${calendar.id}`}
        className="mx-5 mt-4 mb-2"
      >
        Settings
      </Link>
      <div className="bg-slate-200" style={{ height: "1px", width: "100%" }} />
      <div className="mx-2 my-2">
        <Palette
          setIsOpenPalette={setIsOpen}
          color={calendar.defaultColor}
          setColor={(color: string) => {
            updateCalendarColor(calendar.id, color);
            setIsOpenSnackBar(true);
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
