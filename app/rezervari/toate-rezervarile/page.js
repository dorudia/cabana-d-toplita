"use client";

import { useEffect, useState } from "react";
import { getReservations } from "../../lib/actions";
import Rezervare from "../../../components/Rezervare";
import { Button } from "../../../components/ui/button";
import { isAfter, isBefore } from "date-fns";

const page = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    getAllReservations();
  }, []);

  async function getAllReservations() {
    const allReservations = await getReservations();
    setReservations(allReservations);
  }

  const upcomingReservations = reservations.filter((reservation) =>
    isAfter(new Date(reservation.dataSosirii), new Date())
  );

  const pastReservations = reservations.filter((reservation) =>
    isBefore(new Date(reservation.dataPlecrii), new Date())
  );

  const incasari = pastReservations.reduce((total, reservation) => {
    return total + reservation.pretTotal;
  }, 0);

  return (
    <section className="mt-20 mx-auto text-3xl text-center py-4 max-w-7xl">
      <h1 className="text-3xl font-bold text-center py-4">
        Toate Rezervarile:
      </h1>
      <div className="flex flex-wrap gap-2 border-b mb-4 p-4 items-center">
        <Button onClick={() => setActiveTab("all")} size="sm" variant="outline">
          Toate Rezervarile
        </Button>
        <Button
          onClick={() => setActiveTab("past")}
          size="sm"
          variant="outline"
        >
          Rezervarile Anterioare
        </Button>
        <Button
          onClick={() => setActiveTab("upcoming")}
          size="sm"
          variant="outline"
        >
          Rezervarile Viitoare
        </Button>
        <span className="text-lg p-2"> Incasari: {incasari} lei</span>
      </div>
      {activeTab === "all" &&
        reservations.map((rezervare) => (
          <Rezervare
            rezervare={rezervare}
            key={rezervare.id}
            getAllReservations={getAllReservations}
          />
        ))}
      {activeTab === "past" &&
        pastReservations.map((rezervare) => (
          <Rezervare
            rezervare={rezervare}
            key={rezervare.id}
            getAllReservations={getAllReservations}
          />
        ))}
      {activeTab === "upcoming" &&
        upcomingReservations.map((rezervare) => (
          <Rezervare
            rezervare={rezervare}
            key={rezervare.id}
            getAllReservations={getAllReservations}
          />
        ))}
    </section>
  );
};

export default page;
