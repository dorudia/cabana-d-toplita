"use client";

import {
  differenceInDays,
  eachDayOfInterval,
  format,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { ro } from "date-fns/locale/ro";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { toast } from "sonner";
import {
  addNewReservationToDB,
  getReservations,
  getSettings,
  getUserReservations,
} from "../lib/actions";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../@/components/ui/dialog"; // ajustează importul dacă ai alt path
import { loadStripe } from "@stripe/stripe-js";
import { get } from "mongoose";
import { useRouter } from "next/navigation";

function isAlreadyBooked(range, datesArr) {
  if (!range?.from || !range?.to) return false;

  return datesArr.some(({ from, to }) =>
    eachDayOfInterval({ start: from, end: to }).some(
      (date) =>
        isWithinInterval(date, { start: range.from, end: range.to }) &&
        !isSameDay(range.from, to) &&
        !isSameDay(range.to, from)
    )
  );
}

function ReservationDatePicker({ isAdmin }) {
  const { data: session } = useSession();
  const [allReservations, setAllReservations] = useState([]);
  const [settings, setSettings] = useState({});
  const { minNights, pretNoapte } = settings;
  const [reload, setReload] = useState(false);
  const adultiRef = useRef();
  const copiiRef = useRef();
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async (reservationData) => {
    setIsLoading(true);
    try {
      const priceWithDecimals = Math.round(reservationData.pretTotal * 100); // Stripe cere integer

      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: reservationData.userEmail,
          userName: reservationData.userName,
          dataSosirii: reservationData.dataSosirii,
          dataPlecarii: reservationData.dataPlecarii,
          innoptari: reservationData.innoptari,
          numOaspeti: reservationData.numOaspeti,
          description: `Rezervare cabană: ${reservationData.dataSosirii} - ${reservationData.dataPlecarii}`,
          pretTotal: priceWithDecimals,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error || "Unknown error");
        setIsLoading(false);
        toast.error("Eroare la procesarea plății. Încearcă din nou.");
      }
    } catch (err) {
      console.error("HandleCheckout failed:", err);
      setIsLoading(false);
      toast.error("Eroare la procesarea plății. Încearcă din nou.");
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookedDates = allReservations.map((res) => ({
    from: new Date(res.dataSosirii),
    to: new Date(res.dataPlecarii),
  }));

  const startDays = allReservations.map((res) => new Date(res.dataSosirii));
  const endDays = allReservations.map((res) => new Date(res.dataPlecarii));
  const startDayEndDay = startDays.map((startDay) =>
    endDays.find((endDay) => isSameDay(startDay, endDay))
  );

  const modifiers = {
    occupied: allReservations.flatMap((res) =>
      eachDayOfInterval({
        start: new Date(res.dataSosirii),
        end: new Date(res.dataPlecarii),
      })
    ),
    startDay: startDays,
    endDay: endDays,
    startDayEndDay: startDayEndDay,
  };

  const displayRange = isAlreadyBooked(range, bookedDates) ? {} : range;
  const numNights = differenceInDays(range?.to, range?.from);

  const disabledDays = bookedDates.flatMap(({ from, to }) => {
    const days = [];
    let currentDate = new Date(from);
    currentDate.setDate(currentDate.getDate() + 1); // ignoră startDay
    while (currentDate < to) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  });

  async function getReservation() {
    const reservations = await getReservations();
    setAllReservations(reservations);
  }
  useEffect(() => {
    getReservation();
  }, [reload]);

  useEffect(() => {
    getReservation();
  }, [open]);

  useEffect(() => {
    async function fetchSettings() {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data.settings);
    }
    fetchSettings();
  }, []);

  const handleAddReservation = async () => {
    if (!session?.user?.email) {
      toast.error("Trebuie să fii logat.", { duration: 5000 });
      return;
    }

    if (!range?.from || !range?.to) {
      toast.error("Selectează datele de sosire și plecare.", {
        duration: 5000,
      });
      return;
    }

    const adultii = Number(adultiRef.current.value);
    const copii = Number(copiiRef.current.value);
    const innoptari = differenceInDays(range.to, range.from);
    const pretTotal = Number(innoptari * pretNoapte);

    const reservationData = {
      userName: session.user.name || session.user.email.split("@")[0] || "User",
      userEmail: session.user.email,
      dataSosirii: format(range.from, "yyyy.MM.dd"),
      dataPlecarii: format(range.to, "yyyy.MM.dd"),
      innoptari,
      numOaspeti: adultii + copii,
      pretTotal,
    };

    if (isAdmin) {
      await addNewReservationToDB({
        ...reservationData,
        isAdmin,
        sessionId: "dd",
      });
      setRange({ from: undefined, to: undefined });
      await getReservation();
      window.location.reload();
    } else {
      await handleCheckout(reservationData);
    }
  };

  return (
    <Dialog
      className="!max-h-[80vh] !overflow-y-auto"
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          className="text-xl flex flex-wrap items-center justify-center h-auto gap-2 px-2 py-2 md:px-4 md:py-4 my-2 border font-sans"
          style={
            isAdmin && {
              padding: "2px 16px",
              fontSize: "16px",
              // margin: "0 auto",
            }
          }
        >
          {!isAdmin ? "Verifica Disponibilitate" : "Adauga Rezervare"}
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95%] md:w-[700px] p-8 sm:p-12 bg-secondary/90 rounded-[12px] outline outline-1 outline-offset-[-8px] outline-primary relative flex flex-col items-center !max-h-[90%] !overflow-y-scroll -webkit-overflow-scrolling-touch">
        <DialogHeader>
          <DialogTitle className="text-2xl mb-4">Selectează datele</DialogTitle>
          <DialogDescription className="text-lg text-slate-700 dark:text-slate-200">
            Selecteaza data sosirii si plecarii!
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:max-w-[700px] mx-auto w-full md:mb-6">
          <div className="grid gap-6 mb-4">
            <div className="grid gap-2 grid-cols-2">
              <div className="grid gap-2">
                <Label className="text-lg font-geist" htmlFor="adulti">
                  Adulti
                </Label>
                <div className="relative inline-block w-full">
                  <select
                    ref={adultiRef}
                    className="p-2 border border-primary rounded-md w-full appearance-none"
                  >
                    {Array(8)
                      .fill()
                      .map((_, i) => (
                        <option key={i}>{i + 1}</option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg
                      className="w-4 h-4 dark:text-gray-200 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-lg font-geist" htmlFor="adulti">
                  Copii
                </Label>
                <div className="relative inline-block w-full">
                  <select
                    ref={copiiRef}
                    className="p-2 border border-primary rounded-md w-full appearance-none"
                  >
                    {Array(7)
                      .fill()
                      .map((_, i) => (
                        <option key={i}>{i}</option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg
                      className="w-4 h-4 dark:text-gray-200 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              {/* <div className="grid gap-2">
                <Label className="text-lg font-geist" htmlFor="copii">
                  Copii
                </Label>
                <select
                  ref={copiiRef}
                  name="copii"
                  id="copii"
                  className="p-2 border-[1px] border-prymary focus:ring-1 focus:ring-primary/30 rounded-md"
                >
                  {Array(7)
                    .fill()
                    .map((_, i) => (
                      <option key={i}>{i}</option>
                    ))}
                </select>
              </div> */}
            </div>
          </div>
        </div>

        <DayPicker
          captionLayout="buttons"
          mode="range"
          onSelect={(range) => {
            // Adminii pot selecta date în trecut, userii obișnuiți nu
            if (!isAdmin && range?.from && range.from < today) {
              toast.error("Nu puteți selecta zile din trecut");
              setRange({ from: undefined, to: undefined });
              return;
            }
            if (!range?.from || !range?.to) {
              setRange(range);
              return;
            }
            if (range.to === range.from) {
              setRange({ from: undefined, to: undefined });
              return;
            }
            const numNights = differenceInDays(range.to, range.from);
            if (numNights < minNights) {
              toast.error(`Sejur minim de ${minNights} nopți.`, {
                variant: "destructive",
              });
              return;
            }
            if (!isAlreadyBooked(range, bookedDates)) {
              setRange(range);
            } else {
              setRange({ from: undefined, to: undefined });
            }
          }}
          selected={displayRange}
          pagedNavigation
          fromMonth={isAdmin ? undefined : new Date()}
          fromDate={isAdmin ? undefined : new Date()}
          toDate={new Date().setFullYear(new Date().getFullYear() + 5)}
          locale={ro}
          numberOfMonths={2}
          modifiers={modifiers}
          modifiersStyles={{
            occupied: {
              background: "#ff2200",
              color: "white",
              borderRadius: "0",
              pointerEvents: "none",
            },
            startDay: {
              background:
                "linear-gradient(to bottom right, transparent 50%, #ff2200cb 50%)",
              color: "white",
              borderRadius: "0",
              border: "none",
              pointerEvents: "auto",
            },
            endDay: {
              background:
                "linear-gradient(to bottom right, #ff2200cb 50%, transparent 50%)",
              color: "white",
              borderRadius: "0",
              border: "none",
              pointerEvents: "auto",
            },
            startDayEndDay: {
              background:
                "linear-gradient(to bottom right, #ff2200cb 40%, transparent 50%, transparent 50%, #ff2200cb 40%)",
              color: "white",
              borderRadius: "0",
              border: "none",
              pointerEvents: "auto",
            },
          }}
          disabledDays={disabledDays}
          showOutsideDays={false}
          className="md:!scale-125"
        />

        <DialogFooter className="mt-4 md:mt-10  flex flex-col !items-center justify-center">
          {range?.from && range?.to && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex text-xl text-center md:mt-4 border border-primary bg-white text-slate-800 items-center justify-center h-auto gap-2 px-2 py-2 md:px-4 md:py-4 my-2 rounded-sm"
            >
              {`${format(range.from, "dd.MM.yyyy")} / ${format(
                range.to,
                "dd.MM.yyyy"
              )}`}

              {numNights ? `- ${numNights} Nopti,  ` : null}
              {numNights ? `Pret: ${numNights * pretNoapte} RON` : null}
            </motion.div>
          )}
          <Button
            onClick={handleAddReservation}
            disabled={isLoading}
            className="w-fit flex !mx-auto mt-4 text-xl self-center"
          >
            {isLoading ? "Se procesează..." : "Rezerva Acum"}
          </Button>
          <DialogClose asChild>
            <Button className="!bg-transparent absolute top-1 right-1 rounded-full w-fit aspect-square text-slate-800 dark:text-slate-100 hover:!bg-secondary/80 dark:hover:!bg-primary/20 p-2">
              <X className="!w-6 !h-6" />
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ReservationDatePicker;
