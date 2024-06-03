"use client";

import Image from "next/image";

import CheckIcon from "../../../public/check-icon.png";

import { calendarColorOptions } from "@/lib/data";

export default function Palette({
  setIsOpenPalette,
  color,
  setColor,
}: PaletteProps) {
  return (
    <div
      style={{ zIndex: 1000, left: 470, top: 300 }}
      className="grid grid-cols-6 grid-rows-4 gap-3 p-3 w-fit h-fit"
    >
      {Object.keys(calendarColorOptions).map((colorOption) => {
        return (
          <button
            key={colorOption}
            type="button"
            onClick={() => {
              setColor(colorOption);
              setIsOpenPalette(false);
            }}
            className="w-4 h-4 rounded-full flex justify-center items-center"
            style={{ backgroundColor: calendarColorOptions[colorOption] }}
          >
            {color === colorOption && (
              <Image src={CheckIcon} alt="Selected" height={14} width={14} />
            )}
          </button>
        );
      })}
    </div>
  );
}
