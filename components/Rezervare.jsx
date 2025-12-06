"use client";
import { format } from "date-fns";
import React, { useRef, useState } from "react";
import { Mail, Trash2, Edit } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "../@/components/ui/label";
import { Textarea } from "../@/components/ui/textarea";
import { addObservatii, deleteReservation } from "../lib/actions";
import { toast } from "sonner";

const Rezervare = ({ rezervare, getAllReservations }) => {
  const numeRef = useRef();
  const pretRef = useRef();
  const observatiiRef = useRef();
  const closeBtnEditRef = useRef();
  const closeBtnDeleteRef = useRef();

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleUpdateReservation = async () => {
    try {
      const id = rezervare._id;
      const updatedData = {
        userName: numeRef.current.value,
        pretTotal: Number(pretRef.current.value),
        observatii: observatiiRef.current.value,
      };

      const result = await addObservatii(
        id,
        updatedData.observatii,
        updatedData.userName,
        updatedData.pretTotal
      );

      if (result.error) {
        throw new Error(result.error);
      }

      await getAllReservations();
      setOpenEdit(false);
      toast.success("Rezervare actualizată cu succes!");
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast.error("Eroare la actualizarea rezervării: " + error.message);
    }
  };

  const handleDeleteReservation = async () => {
    try {
      const response = await deleteReservation(rezervare._id);
      await getAllReservations();
      setOpenDelete(false);
      toast.success(response, {
        duration: 6000,
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast.error("Eroare la ștergerea rezervării: " + error.message);
    }
  };

  return (
    <div
      key={rezervare._id}
      className="flex flex-wrap items-center font-geist space-x-4 text-lg border border-primary/30 p-2 mx-4 mb-2 capitalize whitespace-nowrap "
    >
      <p className="ml-4">
        creat: {format(new Date(rezervare.createdAt), "dd-MM-yyyy")}
      </p>
      <p>
        sosire:{" "}
        <span className="font-semibold text-lg border border-primary/30 p-1 rounded-md">
          {format(new Date(rezervare.dataSosirii), "dd-MM-yyyy")}
        </span>
      </p>
      <p>
        plecare:{" "}
        <span className="font-semibold text-lg border border-primary/30 p-1 rounded-md">
          {format(new Date(rezervare.dataPlecarii), "dd-MM-yyyy")}
        </span>
      </p>
      <p>oaspeti: {rezervare.numOaspeti}</p>
      <p>innoptari: {rezervare.innoptari}</p>
      <p>pret: {rezervare.pretTotal}</p>
      <p>nume: {rezervare.userName}</p>
      <p className="whitespace-normal">
        observatii: {rezervare.observatii || "N/A"}
      </p>

      <div className="flex space-x-2 !ml-auto">
        {/* Edit Dialog */}
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogTrigger asChild>
            <div className="">
              <Edit className="w-4 h-4" />
            </div>
          </DialogTrigger>
          <DialogContent
            className="max-w-[90%] md:max-w-[50%] w-full"
            aria-describedby="descriere-dialog"
          >
            <DialogHeader>
              <DialogTitle className="capitalize">
                Editează rezervarea
              </DialogTitle>
              <DialogDescription>
                Modifică nume, preț și observații
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nume">Nume:</Label>
                <Input
                  ref={numeRef}
                  id="nume"
                  name="nume"
                  placeholder="Nume client"
                  defaultValue={rezervare.userName}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pret">Preț Total (RON):</Label>
                <Input
                  ref={pretRef}
                  id="pret"
                  name="pret"
                  type="number"
                  placeholder="Preț"
                  defaultValue={rezervare.pretTotal}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="observatii">Observații:</Label>
                <Textarea
                  ref={observatiiRef}
                  id="observatii"
                  name="observatii"
                  placeholder="Observații"
                  rows={4}
                  defaultValue={rezervare.observatii || ""}
                />
              </div>
            </div>
            <Button className="font-bold" onClick={handleUpdateReservation}>
              SALVEAZĂ
            </Button>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button
                  ref={closeBtnEditRef}
                  type="button"
                  variant="secondary"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/75 hover:ring-1 hover:ring-primary/40 h-10 px-4 py-2 ml-auto"
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogTrigger asChild>
            <div className="">
              <Trash2 className="w-4 h-4 text-red-600" />
            </div>
          </DialogTrigger>
          <DialogContent
            className="max-w-[90%]  md:max-w-[50%] w-full font-geist"
            aria-describedby="descriere-dialog"
          >
            <DialogHeader>
              <DialogTitle className="mb-2 font-geist">
                Esti sigur ca vrei sa stergi rezervarea?
              </DialogTitle>
              <DialogDescription>Confirmare stergere</DialogDescription>
            </DialogHeader>
            <Button
              className="font-bold px-8 capitalize bg-red-700 hover:bg-red-800 text-white w-fit mx-auto"
              onClick={handleDeleteReservation}
            >
              Sterge
            </Button>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button
                  ref={closeBtnDeleteRef}
                  type="button"
                  variant="secondary"
                  className="!py-1 !px-4 border hover:border hover:border-primary/30 absolute bottom-1 right-1"
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Rezervare;
