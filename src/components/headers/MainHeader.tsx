"use client";

import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";

import { format, parse, startOfMonth } from "date-fns";

import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "./Header";
import Icon from "../../../public/icon.png";
import SettingIcon from "../../../public/setting-icon.png";

import { getNewMonthByInterval } from "@/lib/functions";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function MainHeader() {
  const pathname = usePathname();
  const pathMonth = pathname.substring(pathname.length - 10);

  return (
    <Header>
      <div className="flex flex-row items-center gap-4 sm:gap-8 mr-5 sm:mr-12">
        <div className="flex flex-row gap-1 sm:gap-2 items-center">
          <Image
            src={Icon}
            alt=""
            width={30}
            sizes="(max-width: 768px) 15px, 30px"
          />
          <div className={`text-xs sm:text-xl ${montserrat.className}`}>
            Calendar
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between gap-3 items-center grow">
        <div className="flex flex-row gap-3 sm:gap-6 items-center">
          <Link
            href={`/month/${format(startOfMonth(new Date()), "yyyy-MM-dd")}`}
            className="flex jusitify-center items-center border border-slate-300 rounded h-7 sm:h-9 px-2 sm:px-3"
          >
            <div className="text-xs sm:text-sm">Today</div>
          </Link>
          <Link href={`/month/${getNewMonthByInterval(pathMonth, -1)}`}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="fa-icon-15"
              style={{ color: "#5F6368", cursor: "pointer" }}
            />
          </Link>
          <Link href={`/month/${getNewMonthByInterval(pathMonth, 1)}`}>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="fa-icon-15"
              style={{ color: "#5F6368", cursor: "pointer" }}
            />
          </Link>
          <h4 className={`text-xs sm:text-xl ${montserrat.className}`}>
            {format(parse(pathMonth, "yyyy-MM-dd", new Date()), "MMMM yyyy")}
          </h4>
        </div>
        <div className="flex flex-row gap-2 sm:gap-6 items-center">
          <Link href="/settings/calendar">
            <Image
              src={SettingIcon}
              alt=""
              width={25}
              sizes="(max-width: 768px) 15px, 25px"
            />
          </Link>
        </div>
      </div>
    </Header>
  );
}
