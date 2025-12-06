"use client";

import { useEffect, useState } from "react";
import {
  getReservations,
  getSettings,
  updateSettings,
} from "../../lib/actions";
import Rezervare from "../../components/Rezervare";
import { Button } from "../../components/ui/button";
import { isAfter, isBefore, differenceInDays, format } from "date-fns";
import { ro } from "date-fns/locale/ro";
import { useSession } from "next-auth/react";
import ReservationDatePicker from "../../components/ReservationDatePicker";
import { set } from "mongoose";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/@/components/ui/dialog";

const isAdmin = true;

const Page = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("all");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({});

  const asyncReservations = async () => {
    setLoading(true);
    await getAllReservations();
    setLoading(false);
  };

  const getAsyncSettings = async () => {
    setLoading(true);
    const settingsFromDB = await getSettings();
    setSettings(settingsFromDB);
    setLoading(false);
  };

  useEffect(() => {
    getAsyncSettings();
  }, []);

  useEffect(() => {
    asyncReservations();
  }, []);

  async function getAllReservations() {
    const res = await fetch("/api/reservations");
    const data = await res.json();
    const rezervari = (data.rezervari || []).map((res) => ({
      ...res,
      dataSosirii: new Date(res.dataSosirii),
      dataPlecarii: new Date(res.dataPlecarii),
    }));
    setReservations(rezervari);
  }

  // Filtrare rezervări pentru taburi
  const upcomingReservations = reservations.filter((reservation) =>
    isAfter(new Date(reservation.dataSosirii), new Date())
  );

  const pastReservations = reservations.filter((reservation) =>
    isBefore(new Date(reservation.dataPlecarii), new Date())
  );

  const incasari = pastReservations.reduce(
    (total, reservation) => total + reservation.pretTotal,
    0
  );

  // Funcție de grupare după luna și anul din data sosirii
  function groupByMonth(reservationsArray) {
    return reservationsArray.reduce((groups, reservation) => {
      const monthYear = format(new Date(reservation.dataSosirii), "LLLL yyyy", {
        locale: ro,
      });
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(reservation);
      return groups;
    }, {});
  }

  let reservationsToDisplay = [];
  if (activeTab === "all") {
    reservationsToDisplay = reservations;
  } else if (activeTab === "past") {
    reservationsToDisplay = pastReservations;
  } else if (activeTab === "upcoming") {
    reservationsToDisplay = upcomingReservations;
  }

  const groupedReservations = groupByMonth(reservationsToDisplay);

  // Aici se verifică dacă user-ul are acces
  const allowedEmail =
    session?.user?.email?.toLowerCase() === "dorudia@gmail.com" ||
    session?.user?.email?.toLowerCase() === "elamoldovan12@gmail.com";

  // Dacă sesiunea încă se încarcă, afișează un loading indicator
  if (status === "loading") {
    return (
      <div className="text-center py-10 text-xl mt-[100px]">Loading...</div>
    );
  }

  return (
    <section className="mt-12 md:mt-28 mx-auto text-3xl text-center py-4 max-w-7xl min-h-[calc(100vh-250px)]">
      {!allowedEmail ? (
        <div>
          <h1 className="text-2xl font-bold text-center mt-[100px]">
            Nu ai dreptul de a accesa această pagină
          </h1>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between mx-4">
            <h1 className="text-3xl font-bold py-4">Rezervari</h1>
            <div className="flex flex-wrap items-center">
              <ReservationDatePicker isAdmin={isAdmin} />
              <div className="flex flex-col mx-2">
                <span className="text-sm">
                  Pret Noapte - {settings.pretNoapte} lei
                </span>
                <span className="text-sm">
                  Sejur Minim - {settings.minNights} nopti
                </span>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Settings className="w-6 h-6 ml-4 cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="w-[95%] md:w-[400px]">
                  <DialogDescription className="hidden">
                    edit settings
                  </DialogDescription>{" "}
                  <DialogHeader className="">
                    <DialogTitle>Rezervari Settings</DialogTitle>
                  </DialogHeader>
                  <form
                    action={() =>
                      updateSettings(settings.minNights, settings.pretNoapte)
                    }
                  >
                    <div className="grid gap-4">
                      <div className="flex flex-col">
                        <label
                          htmlFor="numNights"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2"
                        >
                          Sejur Minim
                        </label>
                        <input
                          className="border border-primary px-2"
                          id="numNights"
                          type="number"
                          name="numNights"
                          value={settings.minNights}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              minNights: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-col">
                        <label
                          htmlFor="pretNoapte"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2"
                        >
                          Pret Noapte
                        </label>
                        <input
                          className="border border-primary px-2"
                          id="pretNoapte"
                          type="number"
                          name="pretNoapte"
                          value={settings.pretNoapte}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              pretNoapte: e.target.value,
                            })
                          }
                        />
                      </div>
                      <DialogClose asChild>
                        <button
                          className="px-4 py-1 rounded-lg bg-primary text-secondary"
                          type="submit"
                        >
                          Salveaza
                        </button>
                      </DialogClose>
                    </div>
                  </form>
                  <DialogClose>Close</DialogClose>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-b mb-4 p-4 items-center">
            <Button
              onClick={() => setActiveTab("all")}
              size="sm"
              variant="outline"
            >
              Toate Rezervările
            </Button>
            <Button
              onClick={() => setActiveTab("past")}
              size="sm"
              variant="outline"
            >
              Rezervările Anterioare
            </Button>
            <Button
              onClick={() => setActiveTab("upcoming")}
              size="sm"
              variant="outline"
            >
              Rezervările Viitoare
            </Button>
            <span className="text-lg p-2">Încasări: {incasari} lei</span>
          </div>
          {loading && <p>Loading...</p>}
          {!loading && Object.keys(groupedReservations).length === 0 && (
            <p className="text-xl">Nu există rezervări.</p>
          )}
          {Object.keys(groupedReservations).map((monthYear) => (
            <div key={monthYear} className="mb-4">
              <h2 className="text-lg text-start pl-4 text-red-600 capitalize py-2 mb-2">
                {monthYear}
              </h2>
              {groupedReservations[monthYear].map((rezervare) => (
                <Rezervare
                  rezervare={rezervare}
                  key={rezervare._id}
                  getAllReservations={getAllReservations}
                />
              ))}
            </div>
          ))}
        </>
      )}
    </section>
  );
};

export default Page;
