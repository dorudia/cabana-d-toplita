"use client";

import { useEffect, useState } from "react";
import { getReservations } from "../../lib/actions";
import Rezervare from "../../../components/Rezervare";
import { Button } from "../../../components/ui/button";
import { isAfter, isBefore, differenceInDays, format } from "date-fns";
import { ro } from "date-fns/locale/ro";

const Page = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    getAllReservations();
  }, []);

  async function getAllReservations() {
    const allReservations = await getReservations();
    setReservations(allReservations || []);
  }

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

  // Functie de grupare după luna și anul din data sosirii
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

  return (
    <section className="mt-20 mx-auto text-3xl text-center py-4 max-w-7xl">
      <h1 className="text-3xl font-bold py-4">Toate Rezervările:</h1>
      <div className="flex flex-wrap gap-2 border-b mb-4 p-4 items-center">
        <Button onClick={() => setActiveTab("all")} size="sm" variant="outline">
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
      {Object.keys(groupedReservations).length === 0 && (
        <p className="text-xl">Nu există rezervări.</p>
      )}
      {Object.keys(groupedReservations).map((monthYear) => (
        <div key={monthYear} className="mb-4">
          <h2 className="text-lg text-start pl-4 capitalize py-2 mb-2">
            {monthYear}
          </h2>
          {groupedReservations[monthYear].map((rezervare) => (
            <Rezervare
              rezervare={rezervare}
              key={rezervare.id}
              getAllReservations={getAllReservations}
            />
          ))}
        </div>
      ))}
    </section>
  );
};

export default Page;
