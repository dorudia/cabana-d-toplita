"use client";
import {
  add,
  differenceInDays,
  eachDayOfInterval,
  format,
  isSameDay,
  isWithinInterval,
  set,
} from "date-fns";
import { ro } from "date-fns/locale/ro";
import { useSession } from "next-auth/react";
import { use, useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  addNewReservationToDB,
  getReservations,
  getSettings,
} from "../app/lib/actions";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner";

function isAlreadyBooked(range, datesArr) {
  if (!range?.from || !range?.to) return false;

  return datesArr.some(({ from, to }) =>
    eachDayOfInterval({ start: from, end: to }).some(
      (date) =>
        isWithinInterval(date, { start: range.from, end: range.to }) &&
        !isSameDay(range.from, to) && // Permite ca range.from să fie endDay
        !isSameDay(range.to, from) // Permite ca range.to să fie startDay
    )
  );
}

function ReservationDatePicker() {
  const { data: session } = useSession();
  const [showCalendar, setShowCalendar] = useState(false);
  const [allReservations, setAllReservations] = useState([]);
  const [settings, setSettings] = useState({});
  const { minNights, pretNoapte } = settings;
  const [reload, setReload] = useState(false);
  const adultiRef = useRef();
  const copiiRef = useRef();
  const [range, setRange] = useState((from, to) => {
    // console.log("range-from:", from, "range-to:", to);
    if (from === to) return;
    return { from: undefined, to: undefined };
  });
  const [error, setError] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const resetRange = () => {
    setRange({ from: undefined, to: undefined });
  };

  const bookedDates = Array.isArray(allReservations)
    ? allReservations.map((reservation) => ({
        from: new Date(reservation.dataSosirii),
        to: new Date(reservation.dataPlecarii),
      }))
    : [];

  const startDays = allReservations.map((res) => new Date(res.dataSosirii));
  const endDays = allReservations.map((res) => new Date(res.dataPlecarii));
  const startDayEndDay = startDays.map((startDay) =>
    endDays.find((endDay) => isSameDay(startDay, endDay))
  );

  const modifiers = {
    occupied: allReservations.flatMap((res) => {
      const from = new Date(res.dataSosirii);
      const to = new Date(res.dataPlecarii);
      return eachDayOfInterval({ start: from, end: to });
    }),
    startDay: startDays,
    endDay: endDays,
    startDayEndDay: startDayEndDay,
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
      // console.log("Rezervări din getAllReservation:", data);
      setAllReservations(data || []); // Asigură că nu e undefined
    }

    fetchReservations();
  }, [reload]);

  useEffect(() => {
    async function fetchSettings() {
      const data = await getSettings();
      // console.log("Settings din getSettings:", data);
      setSettings(data || {});
      console.log("reload:", reload);
    }
    fetchSettings();
  }, []);

  const handleAddReservation = async () => {
    if (!session?.user || !session?.user?.email) {
      toast.error("Nu sunteti logat, va rugam sa va logati.", {
        duration: 9000,
        variant: "destructive",
        action: {
          label: "Mergi la login",
          onClick: () => {
            window.location.href = "/login";
          },
        },
      });
      return;
    }
    if (!range?.from || !range?.to) {
      toast.error("Va rugam selectati o data de sosire si o data de plecare.", {
        duration: 5000,
        variant: "destructive",
      });
      return;
    }
    const adultii = adultiRef.current.value;
    const copii = copiiRef.current.value;
    const userName = session?.user?.name;
    const userEmail = session?.user?.email;
    const dataSosirii = range?.from;
    const dataPlecarii = range?.to;
    const innoptari = numNights;
    const numOaspeti = Number(adultii) + Number(copii);
    const pretTotal = numNights * pretNoapte;

    const response = await addNewReservationToDB({
      userName,
      userEmail,
      dataSosirii: format(dataSosirii, "yyyy.MM.dd"),
      dataPlecarii: format(dataPlecarii, "yyyy.MM.dd"),
      innoptari,
      numOaspeti,
      pretTotal,
    });

    if (response.error) {
      setError(response.error);
      toast.error(response.error, {
        duration: 5000,
        variant: "destructive",
      });
    } else {
      toast.success(response, {
        duration: 5000,
        variant: "default",
      });
    }
    setReload((prev) => !prev);
    setShowCalendar(false);
    resetRange();
  };

  return (
    <div className="w-fit absolute left-1/2 -translate-x-1/2 top-[calc(100%-33px)] flex flex-col items-center justify-end">
      <Button
        onClick={() => setShowCalendar((prev) => !prev)}
        className="text-xl flex flex-wrap items-center justify-center h-auto gap-2 px-2 py-2 md:px-4 md:py-4 my-2 border font-sans"
      >
        {range?.from && range?.to
          ? `${format(range.from, "dd.MM.yyyy")} / ${format(
              range.to,
              "dd.MM.yyyy"
            )}`
          : "VERIFICA DISPONIBILITATE"}
        <span className={!numNights ? "hidden" : ""}>
          {numNights ? `-   ${numNights} Nopti,  ` : null}
          {numNights ? `  Pret: ${numNights * pretNoapte} RON` : null}
        </span>
      </Button>
      {showCalendar && (
        <div className="w-fit  p-8  sm:p-12 bg-secondary/90 items-center0 rounded-[12px] outline outline-1 outline-offset-[-8px] outline-primary relative">
          {/* <form action={addNewReservationToDB} className=""> */}
          <div className="grid gap-6 md:max-w-[500px] mx-auto">
            <div className="grid gap-6 mb-4">
              <div className="grid gap-2 grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="adulti">Adulti</Label>
                  <select
                    ref={adultiRef}
                    name="adulti"
                    id="adulti"
                    className="p-2 border-[1px] border-prymary focus:ring-1 focus:ring-primary/30 rounded-md"
                  >
                    {Array(8)
                      .fill()
                      .map((_, i) => (
                        <option key={i}>{i + 1}</option>
                      ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="copii">Copii</Label>
                  <select
                    ref={copiiRef}
                    name="cpoii"
                    id="copii"
                    className="p-2 border-[1px] border-prymary focus:ring-1 focus:ring-primary/30 rounded-md"
                  >
                    {Array(7)
                      .fill()
                      .map((_, i) => (
                        <option key={i}>{i}</option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <DayPicker
            captionLayout="buttons"
            mode="range"
            onSelect={(range) => {
              if (range?.from && range.from < today) {
                toast.error("Nu puteți selecta zile din trecut");
                setRange({ from: undefined, to: undefined });
                return;
              }
              if (!range?.from || !range?.to) {
                setRange(range); // Permite selecția inițială
                return;
              }
              console.log("range:", range);
              if (range.to === range.from) {
                setRange({ from: undefined, to: undefined });
                return;
              }

              // console.log("range:::::::", range.from, range.to);

              const numNights = differenceInDays(range.to, range.from);

              if (numNights < minNights) {
                setError(`Trebuie să selectezi cel puțin ${minNights} nopți.`);
                console.log("error:", error);
                console.log(
                  `Trebuie să selectezi cel puțin ${minNights} nopți.`
                );
                toast.error(error, {
                  title: `Minim ${minNights} nopți.`,
                  description: `Se inchiriaza pentru cel puțin ${minNights} nopți.`,
                  variant: "destructive",
                });
                return;
              }

              if (!isAlreadyBooked(range, bookedDates)) {
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
            // toMonth={set(new Date(), { month: new Date().getMonth() + 6 })}
            toMonth={
              new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            }
            locale={ro}
            numberOfMonths={2} // Afișează două luni
            // month={new Date()}
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
                  "linear-gradient(to bottom right, transparent 50%, #f6080875 50%)",
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
                  "linear-gradient(to bottom right, #f6080875 50%, transparent 50%)", // Triunghi pe dreapta
                color: "white",
                borderRadius: "0", // Elimină rotunjirea
                border: "none",
                pointerEvents: "auto",
              },
              startDayEndDay: {
                background:
                  "linear-gradient(to bottom right, #f6080875 40%, transparent 50%, transparent 50%, #f6080875 40%)", // Triunghi pe dreapta
                color: "white",
                borderRadius: "0", // Elimină rotunjirea
                border: "none",
                pointerEvents: "auto",
              },
            }}
            disabledDays={disabledDays}
            showOutsideDays={false}
          />
          <Button
            onClick={handleAddReservation}
            className="w-fit flex mb-0 mx-auto absolute top-[calc(100%-26px)] left-1/2 -translate-x-1/2 text-xl"
          >
            Rezerva Acum
          </Button>
        </div>
      )}
    </div>
  );
}

export default ReservationDatePicker;
