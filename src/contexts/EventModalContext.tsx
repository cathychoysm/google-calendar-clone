"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type EventModalContextType = {
  isOpenEventModal: boolean;
  setIsOpenEventModal: Dispatch<SetStateAction<boolean>>;
  event: CalendarEvent | null;
  setEvent: Dispatch<SetStateAction<CalendarEvent | null>>;
  position: Position;
  setPosition: Dispatch<SetStateAction<Position>>;
};

const EventModalContext = createContext<EventModalContextType>({
  isOpenEventModal: false,
  setIsOpenEventModal: () => {},
  event: null,
  setEvent: () => {},
  position: { top: 0, left: 0 },
  setPosition: () => {},
});

export default function useEventModalContext() {
  return useContext(EventModalContext);
}

export const EventModalContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isOpenEventModal, setIsOpenEventModal] = useState<boolean>(false);
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });

  return (
    <EventModalContext.Provider
      value={{
        isOpenEventModal,
        setIsOpenEventModal,
        event,
        setEvent,
        position,
        setPosition,
      }}
    >
      {children}
    </EventModalContext.Provider>
  );
};
