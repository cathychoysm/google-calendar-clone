"use client";

import { Montserrat } from "next/font/google";
import { useRouter } from "next/navigation";
import useLastVisitedMonthContext from "@/contexts/lastVisitedMonthContext";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "./Header";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function SettingsHeader() {
  const router = useRouter();

  const { lastVisitedMonth } = useLastVisitedMonthContext();

  return (
    <Header>
      <div className="flex flex-row items-center gap-6">
        <FontAwesomeIcon
          icon={faArrowLeft}
          onClick={() => router.push(`/month/${lastVisitedMonth}`)}
          cursor="pointer"
          style={{ fontSize: 20 }}
        />
        <div className={`${montserrat.className}`}>Settings</div>
      </div>
    </Header>
  );
}
