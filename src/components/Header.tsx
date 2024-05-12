import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Icon from "../../public/icon.png";
import AccountIcon from "../../public/account-icon.png";
import AppIcon from "../../public/apps-icon.png";
import SupportIcon from "../../public/support-icon.png";
import SettingIcon from "../../public/setting-icon.png";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Header() {
  return (
    <header className="flex flex-row justify-between items-center h-16 px-6 py-4 border-b border-b-slate-300">
      <div className="flex flex-row items-center gap-8 mr-12">
        <FontAwesomeIcon
          icon={faBars}
          style={{ height: "20px", color: "#5F6368", cursor: "pointer" }}
        />
        <div className="flex flex-row gap-2 items-center">
          <Image src={Icon} alt="" width={30} height={30} />
          <div className={`text-slate-600 text-xl ${montserrat.className}`}>
            Calendar
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center grow">
        <div className="flex flex-row gap-6 items-center">
          <button className="border border-slate-300 text-slate-600 rounded h-9 px-3 text-sm">
            Today
          </button>
          <FontAwesomeIcon
            icon={faChevronLeft}
            style={{ height: "15px", color: "#5F6368", cursor: "pointer" }}
          />
          <FontAwesomeIcon
            icon={faChevronRight}
            style={{ height: "15px", color: "#5F6368", cursor: "pointer" }}
          />
          <h4 className={`text-slate-600 text-xl ${montserrat.className}`}>
            May 2024
          </h4>
        </div>
        <div className="flex flex-row gap-6 items-center">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{ height: "20px", color: "#5F6368", cursor: "pointer" }}
          />
          <Image src={SupportIcon} alt="" width={25} height={25} />
          <Image src={SettingIcon} alt="" width={25} height={25} />
          <button className="border border-slate-300 text-slate-600 rounded h-9 px-3 text-sm flex flex-row items-center gap-3">
            <div>Month</div>
            <div>&#9662;</div>
          </button>
          <div>calendar | tasks</div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-4 ml-6">
        <Image src={AppIcon} alt="" width={25} height={25} />
        <Image src={AccountIcon} alt="" width={30} height={30} />
      </div>
    </header>
  );
}
