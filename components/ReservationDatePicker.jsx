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
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../@/components/ui/dialog"; // ajustează importul dacă ai alt path
import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";

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

function ReservationDatePicker() {
  const { data: session } = useSession();
  const [allReservations, setAllReservations] = useState([]);
  const [settings, setSettings] = useState({});
  const { minNights, pretNoapte } = settings;
  const [reload, setReload] = useState(false);
  const adultiRef = useRef();
  const copiiRef = useRef();
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [error, setError] = useState("");
  const stripePromise = loadStripe(
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_STRIPE_PUBISHABLE_KEY
      : process.env.NEXT_PUBLIC_STRIPE_PUBISHABLE_KEY_TEST
  );

  async function handleCheckout(reservationData, pretTotal) {
    try {
      // 1️⃣ Pregătim datele pentru backend
      const payload = {
        userEmail: reservationData.userEmail,
        description: `Rezervare cabană: ${reservationData.dataSosirii} - ${reservationData.dataPlecarii}`,
        amount: pretTotal,
        reservationData,
      };

      // 2️⃣ Trimitem request către server
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // 3️⃣ Dacă serverul a returnat url-ul de checkout, redirecționăm
      if (data.url) {
        window.location.href = data.url; // simplu, fără stripePromise
      } else if (data.error) {
        console.error("Checkout error:", data.error);
        toast.error("Eroare la inițierea plății.");
      }
    } catch (err) {
      console.error("HandleCheckout failed:", err);
      toast.error("Eroare la inițierea plății.");
    }
  }

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

  useEffect(() => {
    async function fetchReservations() {
      const res = await fetch("/api/reservations");
      const data = await res.json();
      const rezervari = (data.rezervari || []).map((res) => ({
        ...res,
        dataSosirii: new Date(res.dataSosirii),
        dataPlecarii: new Date(res.dataPlecarii),
      }));
      setAllReservations(rezervari);
    }
    fetchReservations();
  }, [reload]);

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
    const pretTotal = innoptari * pretNoapte;

    const reservationData = {
      userName: session.user.name,
      userEmail: session.user.email,
      dataSosirii: format(range.from, "yyyy.MM.dd"),
      dataPlecarii: format(range.to, "yyyy.MM.dd"),
      innoptari,
      numOaspeti: adultii + copii,
      pretTotal,
    };

    await handleCheckout(reservationData, pretTotal);
  };

  // const handleAddReservation = async () => {
  //   if (!session?.user?.email) {
  //     toast.error("Sejur minim de " + minNights + " nopti.", {
  //       duration: 9000,
  //       variant: "destructive",
  //       action: {
  //         label: "Mergi la login",
  //         onClick: () => (window.location.href = "/login"),
  //       },
  //     });
  //     return;
  //   }

  //   if (!range?.from || !range?.to) {
  //     toast.error("Selectează data de sosire și de plecare.", {
  //       duration: 5000,
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   const adultii = Number(adultiRef.current.value);
  //   const copii = Number(copiiRef.current.value);
  //   const numOaspeti = adultii + copii;
  //   const innoptari = differenceInDays(range.to, range.from);
  //   const pretTotal = innoptari * pretNoapte;

  //   console.log("Go to CheckoutPage");

  //   // await handleCheckout();

  //   try {
  //     const response = await fetch("/api/reservations", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         userName: session.user.name,
  //         userEmail: session.user.email,
  //         dataSosirii: format(range.from, "yyyy.MM.dd"),
  //         dataPlecarii: format(range.to, "yyyy.MM.dd"),
  //         innoptari,
  //         numOaspeti,
  //         pretTotal,
  //       }),
  //     });

  //     const result = await response.json();

  //     if (result.error) {
  //       toast.error(result.error, { duration: 5000, variant: "destructive" });
  //     } else {
  //       toast.success(result.message, { duration: 5000 });
  //       setReload((prev) => !prev);
  //       setRange({ from: undefined, to: undefined });
  //     }
  //   } catch (err) {
  //     toast.error("Eroare la crearea rezervării.", {
  //       duration: 5000,
  //       variant: "destructive",
  //     });
  //     console.error(err);
  //   }
  // };

  return (
    <Dialog className="!max-h-[80vh] !overflow-y-auto">
      <DialogTrigger asChild>
        <Button className="text-xl flex flex-wrap items-center justify-center h-auto gap-2 px-2 py-2 md:px-4 md:py-4 my-2 border font-sans">
          Verifica Disponibilitate
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95%] md:w-[700px] p-8 sm:p-12 bg-secondary/90 rounded-[12px] outline outline-1 outline-offset-[-8px] outline-primary relative flex flex-col items-center !max-h-[90%] !overflow-y-scroll -webkit-overflow-scrolling-touch">
        <DialogHeader>
          <DialogTitle className="text-2xl mb-4">Selectează datele</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:max-w-[700px] mx-auto w-full">
          <div className="grid gap-6 mb-4">
            <div className="grid gap-2 grid-cols-2">
              <div className="grid gap-2">
                <Label className="text-lg font-geist" htmlFor="adulti">
                  Adulti
                </Label>
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
          fromMonth={new Date()}
          fromDate={new Date()}
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
            className="w-fit flex !mx-auto mt-4 text-xl self-center"
          >
            Rezerva Acum
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
