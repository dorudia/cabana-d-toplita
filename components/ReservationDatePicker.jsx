"use client";
import {
  differenceInDays,
  eachDayOfInterval,
  format,
  isSameDay,
  isWithinInterval,
  set,
} from "date-fns";
import { ro } from "date-fns/locale/ro";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { getReservations } from "../app/lib/actions";
import { Button } from "./ui/button";

// help func
// function isAlreadyBooked(range, datesArr) {
//   if (range) {
//     isSameDay(range.from, range.to) ? (range.to = null) : null;
//     return (
//       range.from &&
//       range.to &&
//       datesArr.some((date) =>
//         isWithinInterval(date, { start: range.from, end: range.to })
//       )
//     );
//   }
// }

function isAlreadyBooked(range, bookedDates) {
  if (!range?.from || !range?.to) return false;

  const selectedDays = eachDayOfInterval({ start: range.from, end: range.to });

  return bookedDates.some(({ from, to }) =>
    selectedDays.some((day) => isWithinInterval(day, { start: from, end: to }))
  );
}

function ReservationDatePicker() {
  const { data: session } = useSession();
  const [showCalendar, setShowCalendar] = useState(false);
  const [allReservations, setAllReservations] = useState([]);
  const [range, setRange] = useState((from, to) => {
    if (from === to) return;
    return { from: undefined, to: undefined };
  });

  const resetRange = () => {
    setRange({ from: null, to: null });
  };

  const bookedDates = Array.isArray(allReservations)
    ? allReservations.map((reservation) => ({
        from: new Date(reservation.dataSosirii),
        to: new Date(reservation.dataPlecrii),
      }))
    : [];

  const startDays = allReservations.map((res) => new Date(res.dataSosirii));
  const endDays = allReservations.map((res) => new Date(res.dataPlecrii));

  const modifiers = {
    occupied: allReservations.flatMap((res) => {
      const from = new Date(res.dataSosirii);
      const to = new Date(res.dataPlecrii);
      return eachDayOfInterval({ start: from, end: to });
    }),
    startDay: startDays,
    endDay: endDays,
  };

  const displayRange = isAlreadyBooked(range, bookedDates) ? {} : range; //inlocuieste cu zilele rezervate

  const numNights = differenceInDays(range?.to, range?.from);

  const disabledDays = bookedDates.flatMap(({ from, to }) => {
    const days = [];
    let currentDate = new Date(from);
    currentDate.setDate(currentDate.getDate() + 1); // Ignoră startDay

    while (currentDate < to) {
      // Ignoră endDay
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  });

  useEffect(() => {
    async function fetchReservations() {
      const data = await getReservations();
      console.log("Rezervări din getAllReservation:", data);
      setAllReservations(data || []); // Asigură că nu e undefined
    }

    fetchReservations();
  }, []);

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
        <div className="w-fit  p-4  sm:p-12 bg-secondary/90 items-center z-10 rounded-[12px] outline outline-1 outline-offset-[-8px] outline-primary ">
          <DayPicker
            captionLayout="buttons"
            mode="range"
            // onSelect={(range) => {
            //   setRange(range);
            // }}
            // onSelect={(range) => {
            //   // Aici verificăm dacă intervalul selectat include zile ocupate
            //   if (!isAlreadyBooked(range, bookedDates)) {
            //     setRange(range);
            //   }
            // }}
            onSelect={(range) => {
              if (range && !isAlreadyBooked(range, bookedDates)) {
                setRange(range);
              } else {
                console.log("Intervalul conține zile ocupate.");
                setRange({ from: undefined, to: undefined }); // Resetăm selecția
              }
            }}
            selected={displayRange}
            pagedNavigation={true}
            fromMonth={new Date()}
            fromDate={new Date()}
            toDate={new Date().setFullYear(new Date().getFullYear() + 5)}
            toMonth={set(new Date(), { month: new Date().getMonth() + 6 })}
            locale={ro}
            numberOfMonths={2} // Afișează două luni
            month={new Date()}
            modifiers={modifiers}
            modifiersStyles={{
              occupied: {
                background: "#ff2200 ", // Fundal roșu pentru zilele ocupate
                color: "white",
                borderRadius: "0", // Elimină rotunjirea
                pointerEvents: "none",
              },
              startDay: {
                background:
                  "linear-gradient(to bottom right, transparent 50%, #ff553b53 50%)",
                // linear-gradient(
                //   to bottom right,
                //   transparent 50%,
                //   ##b22806 50%
                // ) !important; // Triunghi pe stânga
                color: "white",
                borderRadius: "0", // Elimină rotunjirea
                border: "none",
                pointerEvents: "auto",
              },
              endDay: {
                background:
                  "linear-gradient(to bottom right, #ff553b53 50%, transparent 50%)", // Triunghi pe dreapta
                color: "white",
                borderRadius: "0", // Elimină rotunjirea
                border: "none",
                pointerEvents: "auto",
              },
            }}
            disabledDays={disabledDays}
            showOutsideDays
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
