type MainBodyProps = {
  calendars: Calendar[];
  datesWithEvents: DatesWithEvents;
};

type SideBarProps = {
  calendars: Calendar[];
};

type CalendarProps = {
  datesWithEvents: DatesWithEvents;
};

type MiniCalendarProps = {
  onClickDate: (date: string) => void;
};

type CreateEventFormProps = {
  calendars: Calendar[];
  loading: boolean;
};

type DeleteCalendarModalProps = {
  calendar: Calendar;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type PaletteProps = {
  setIsOpenPalette: React.Dispatch<React.SetStateAction<boolean>>;
  color: string;
  setColor: (color: string) => void;
};

type ColorPickerProps = {
  value: string;
  setColor: (color: string) => void;
};

type CalendarDropDownOptionsProps = {
  calendar: Calendar;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
