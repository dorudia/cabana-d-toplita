"use client";
import { format } from "date-fns";
import React, { useRef } from "react";
import { Mail, Trash2 } from "lucide-react";
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

import { Label } from "../@/components/ui/label";
import { Textarea } from "../@/components/ui/textarea";
import { addObservatii, deleteReservation } from "@/lib/actions";
import { toast } from "sonner";

const Rezervare = ({ rezervare, getAllReservations }) => {
  const textareaRef = useRef();
  const closeBtnRef = useRef();

  const handleAddObservations = async () => {
    const id = rezervare._id;
    await addObservatii(id, textareaRef.current.value);
    getAllReservations();
    closeBtnRef.current.click();
  };

  const handleDeleteReservation = async () => {
    if (
      confirm(
        `sigur vrei sa stergi rezervarea ${format(rezervare.dataSosirii, "dd-MM-yyyy")}/${format(rezervare.dataPlecarii, "dd-MM-yyyy")} ? ${rezervare.dataPlecarii} `
      )
    ) {
      const response = await deleteReservation(rezervare._id);
      getAllReservations();
      toast.success(response, {
        duration: 6000,
        variant: "default",
      });
      getAllReservations();
    }
  };

  return (
    <div
      key={rezervare.id}
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

      <Dialog>
        <DialogTrigger asChild>
          <p
            onClick={() => {
              console.log("rezervare.observatii:", rezervare.observatii);
            }}
            className="whitespace-normal cursor-pointer hover:underline"
          >
            observatii: {rezervare.observatii}
          </p>
        </DialogTrigger>
        <DialogContent
          className="max-w-[90%]  md:max-w-[50%] w-full"
          aria-describedby="descriere-dialog"
        >
          <DialogHeader>
            <DialogTitle className="capitalize">adauga observatii</DialogTitle>
            <DialogDescription>detaliile rezervarii</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="observatii" className="text-xl">
              Observatii:
            </Label>
            <Textarea
              ref={textareaRef}
              className="text-xl text-red"
              id="observatii"
              name="observatii"
              placeholder="Observaii"
              rows={4}
              defaultValue={rezervare.observatii}
            />
          </div>
          <Button className="font-bold" onClick={handleAddObservations}>
            ADAUGA
          </Button>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                ref={closeBtnRef}
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
      <Button
        onClick={handleDeleteReservation}
        size="sm"
        variant="destructive"
        className="!ml-auto"
      >
        <Trash2 />
      </Button>
    </div>
  );
};

export default Rezervare;
