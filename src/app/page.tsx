const daysOfWeek: string[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const weekRows: number[] = [1, 2, 3, 4, 5];
const tempDateArray = Array.from({ length: 35 }, (_, index) => index + 1);

export default function Home() {
  return (
    <div className="flex flex-row width-calendar height-calendar py-3">
      <div className="flex flex-col">
        <div className="bg-slate-100 h-5 w-6"></div>
        {weekRows.map((week) => {
          return (
            <div
              key={week}
              className="grow bg-slate-100 w-6 text-center text-slate-600 text-xs border-b border-b-slate-300 pt-2"
            >
              {week}
            </div>
          );
        })}
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-row h-5">
          {daysOfWeek.map((day) => {
            return (
              <div
                key={day}
                className="basis-0 grow text-center text-xs border-r border-r-slate-300 pt-2"
              >
                {day}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-7 grid-rows-5 h-full">
          {tempDateArray.map((date) => {
            return (
              <div
                key={date}
                className="text-center text-xs border-b border-b-slate-300 border-r border-r-slate-300 pt-2"
              >
                {date}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
