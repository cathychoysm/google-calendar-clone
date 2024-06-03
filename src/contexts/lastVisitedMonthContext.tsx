"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { lightFormat, startOfMonth } from "date-fns";

type LastVisitedMonthContextType = {
  lastVisitedMonth: string;
  setLastVisitedMonth: Dispatch<SetStateAction<string>>;
};

const LastVisitedMonthContext = createContext<LastVisitedMonthContextType>({
  lastVisitedMonth: lightFormat(startOfMonth(new Date()), "yyyy-MM-dd"),
  setLastVisitedMonth: () => {},
});

export default function useLastVisitedMonthContext() {
  return useContext(LastVisitedMonthContext);
}

export const LastVisitedMonthContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [lastVisitedMonth, setLastVisitedMonth] = useState<string>(
    lightFormat(startOfMonth(new Date()), "yyyy-MM-dd")
  );

  return (
    <LastVisitedMonthContext.Provider
      value={{
        lastVisitedMonth,
        setLastVisitedMonth,
      }}
    >
      {children}
    </LastVisitedMonthContext.Provider>
  );
};
