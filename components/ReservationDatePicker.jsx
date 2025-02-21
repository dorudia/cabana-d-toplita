import { useEffect, useState } from "react";
import { DayPicker, getDefaultClassName } from "react-day-picker";
import { ro } from "date-fns/locale/ro";
import "react-day-picker/dist/style.css";
import { isBefore, format, isSameDay, differenceInDays } from "date-fns";
import { Button } from "./ui/button";

// help func
function isAlreadyBooked(range, datesArr) {
  if (range) {
    isSameDay(range.from, range.to) ? (range.to = null) : null;
    return (
      range.from &&
      range.to &&
      datesArr.some((date) =>
        isWithinInterval(date, { start: range.from, end: range.to })
      )
    );
  }
}

function ReservationDatePicker() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState((from, to) => {
    if ((from = to)) return;
    return { from: undefined, to: undefined };
  });

  const resetRange = () => {
    setRange({ from: null, to: null });
  };

  const displayRange = isAlreadyBooked(range, []) ? {} : range; //inlocuieste cu zilele rezervate

  const numNights = differenceInDays(range?.to, range?.from);

  //   useEffect(() => {
  //     // Acesta va rula după ce s-a actualizat starea range
  //     console.log("Range selected after update: ", range);
  //   }, [range]);

  //   const selectedRange =
  //     range.from && range.to ? [range?.from, range?.to] : undefined;

  return (
    <div className="w-fit absolute left-1/2 -translate-x-1/2 top-[90%] flex flex-col items-center justify-end">
      <Button
        onClick={() => setShowCalendar((prev) => !prev)}
        className="text-xl flex gap-4 px-8 my-2 border font-sans"
      >
        {range?.from && range?.to
          ? `${format(range.from, "dd.MM.yyyy")} / ${format(
              range.to,
              "dd.MM.yyyy"
            )}`
          : "VERIFICA DISPONIBILITATE"}
        <span>
          {" "}
          {numNights ? ` ${numNights} Nopti ` : null} -{" "}
          {numNights ? `  Pret: ${numNights * 900} RON` : null}
        </span>
      </Button>
      {showCalendar && (
        <div className="w-fit  p-4  sm:p-12 bg-secondary/80 items-center z-10 rounded-[12px] outline outline-1 outline-offset-[-8px] outline-primary ">
          <DayPicker
            captionLayout="dropdown"
            mode="range"
            onSelect={(range) => setRange(range)}
            selected={displayRange}
            pagedNavigation={true}
            fromMonth={new Date()}
            fromDate={new Date()}
            toYear={new Date().getFullYear() + 5}
            locale={ro}
            numberOfMonths={2} // Afișează două luni
            month={new Date()}
          />
          <Button className="w-fit flex mt-4 mb-0 mx-auto absolute left-1/2 -translate-x-1/2 text-xl">
            Rezerva Acum
          </Button>
        </div>
      )}
    </div>
  );
}

export default ReservationDatePicker;
