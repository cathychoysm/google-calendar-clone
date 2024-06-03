import {
  parse,
  startOfISOWeek,
  getISOWeek,
  addDays,
  format,
  lightFormat,
  addMinutes,
  addHours,
  isAfter,
  addMonths,
} from "date-fns";

// Function to get the first ISO week day of a given date string
function getFirstDateOfISOWeek(dateString: string): Date {
  const date = parse(dateString, "yyyy-MM-dd", new Date());
  return startOfISOWeek(date);
}

// Function to generate date arrays
export function generateDateArrays(dateString: string): {
  dates: string[];
  weeks: number[];
} {
  const startDate = getFirstDateOfISOWeek(dateString);
  const dates: string[] = [];
  const weeks: number[] = [];
  const tempWeeksSet: Set<number> = new Set();

  for (let i = 0; i < 42; i++) {
    const currentDate = addDays(startDate, i);
    dates.push(format(currentDate, "yyyy-MM-dd"));
    const weekNumber = getISOWeek(currentDate);
    if (!tempWeeksSet.has(weekNumber)) {
      tempWeeksSet.add(weekNumber);
      weeks.push(weekNumber);
    }
  }

  return { dates, weeks };
}

// Generate new date string of month by interval
export function getNewMonthByInterval(
  dateString: string,
  interval: number
): string {
  const date = parse(dateString, "yyyy-MM-dd", new Date());
  const newDate = addMonths(date, interval);
  return format(newDate, "yyyy-MM-01");
}

// Event form date & time check
function combineDateAndTime(date: string, time: string): Date {
  const [hour, minute] = time.split(":").map(Number);
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());
  const combinedDate = addMinutes(addHours(parsedDate, hour), minute);
  return combinedDate;
}

export function isStartTimeBeforeEndTime(
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string
): boolean {
  const startDateTime = combineDateAndTime(startDate, startTime);
  const endDateTime = combineDateAndTime(endDate, endTime);

  // Equal also counted as before
  return !isAfter(startDateTime, endDateTime);
}

export function ISODateToDisplayDate(dateString: string) {
  const currentYear = lightFormat(new Date(), "yyyy");

  if (dateString.slice(0, 4) === currentYear) {
    return format(parse(dateString, "yyyy-MM-dd", new Date()), "EEEE, d MMMM");
  }

  return format(
    parse(dateString, "yyyy-MM-dd", new Date()),
    "EEEE, d MMMM yyyy"
  );
}
