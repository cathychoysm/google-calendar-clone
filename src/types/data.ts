type EventFormData = {
  title: string;
  isAllDay: boolean;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  description: string;
  calendarId: string;
  color: string;
};

type Calendar = {
  id: string;
  name: string;
  defaultColor: string;
  show: boolean;
};

type CalendarFormData = {
  name: string;
  color: string;
};

type CreateUserType = {
  name: string;
  email: string;
  password: string;
};

type GoogleIcon = {
  size: number;
};

type CreateEventFormFormikValues = {
  title: string;
  isAllDay: boolean;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
  calendarId: string;
  color: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  isAllDay: boolean;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  description: string;
  color: string;
  calendarId: string;
  calendar: string;
  show?: boolean;
};

type DatesWithEvents = {
  date: string;
  events: CalendarEvent[];
}[];

type CalendarColorOptions = {
  [key: string]: string;
};

type Position = {
  top: number;
  left: number;
};
