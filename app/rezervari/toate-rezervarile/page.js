import React from "react";
import { getReservations } from "../../lib/actions";
import AllReservations from "../../../components/AllReservations";

const page = async () => {
  const reservations = await getReservations();
  console.log("rezervari:", reservations);
  return (
    <section className="mt-20 mx-auto text-3xl text-center py-4 max-w-7xl">
      <h1 className="text-3xl font-bold text-center py-4">
        Toate Rezervarile:
      </h1>
      {reservations.map((rezervare) => (
        <AllReservations rezervare={rezervare} key={rezervare.id} />
      ))}
      {/* <table className="w-full text-lg text-center mt-4">
        <thead>
          <tr>
            <th>creata la:</th>
            <th>data sosire:</th>
            <th>data plecare:</th>
            <th>innoptari:</th>
            <th>numar oaspeti:</th>
            <th>pret total:</th>
            <th>observatii:</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((rezervare) => (
            <tr key={rezervare.id}>
              <td>
                {format(new Date(rezervare.created_at), "dd-MM-yyyy/HH:mm:ss")}
              </td>
              <td>{format(new Date(rezervare.dataSosirii), "dd-MM-yyyy")}</td>
              <td>{format(new Date(rezervare.dataPlecrii), "dd-MM-yyyy")}</td>
              <td>{rezervare.innoptari}</td>
              <td>{rezervare.numOaspeti}</td>
              <td>{rezervare.pretTotal}</td>
              <td>{rezervare.observatii}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </section>
  );
};

export default page;
