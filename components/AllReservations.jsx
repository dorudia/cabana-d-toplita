"use client";
import { format } from "date-fns";
import React, { useRef } from "react";
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

const AllReservations = ({ rezervare }) => {
  const textareaRef = useRef();
  return (
    <div
      key={rezervare.id}
      className="flex flex-wrap space-x-4 text-lg border border-primary/30 p-2 mx-4 mb-2 capitalize whitespace-nowrap "
    >
      <p className="ml-4">
        creat: {format(new Date(rezervare.created_at), "dd-MM-yyyy/HH:mm:ss")}
      </p>
      <p>sosire: {format(new Date(rezervare.dataSosirii), "dd-MM-yyyy")}</p>
      <p>
        plecare:
        {format(new Date(rezervare.dataPlecrii), "dd-MM-yyyy")}
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
            className="whitespace-normal
"
          >
            observatii: {rezervare.observatii}
          </p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="capitalize">adauga observatii</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="observatii">Observatii</Label>
            <Textarea
              ref={textareaRef}
              className=""
              id="observatii"
              name="observatii"
              placeholder="Observaii"
              rows={4}
              defaultValue={rezervare.observatii}
            />
          </div>
          <Button
            onClick={() =>
              console.log("textareaRef:", textareaRef.current.value)
            }
          >
            Adauga
          </Button>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
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
    </div>
  );
};

export default AllReservations;
