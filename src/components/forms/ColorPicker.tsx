import { useEffect, useRef, useState } from "react";

import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Palette from "./Palette";

import { calendarColorOptions } from "@/lib/data";

export default function ColorPicker({ value, setColor }: ColorPickerProps) {
  const [isOpenPalette, setIsOpenPalette] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const paletteRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        paletteRef.current &&
        buttonRef.current &&
        !paletteRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpenPalette(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpenPalette(!isOpenPalette)}
        className="flex flex-row items-center justify-between p-2 w-16 rounded bg-slate-100 mr-3 hover:bg-slate-200"
      >
        <div
          className="w-5 h-5 rounded-full"
          style={{ backgroundColor: calendarColorOptions[value] }}
        />
        <FontAwesomeIcon icon={faCaretDown} style={{ width: 15, height: 15 }} />
      </button>
      {isOpenPalette && (
        <div
          ref={paletteRef}
          className="absolute rounded bg-white border border-slate-100 shadow-lg"
        >
          <Palette
            setIsOpenPalette={setIsOpenPalette}
            color={value}
            setColor={(color) => {
              setColor(color);
            }}
          />
        </div>
      )}
    </div>
  );
}
