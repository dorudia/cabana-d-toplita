"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/@/components/ui/dialog";
import { Button } from "@/@/components/ui/button";

export default function ContactPageForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const closeBtnRef = useRef();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(data.message);
        setForm({ name: "", email: "", message: "" });
      } else {
        setSuccessMessage(data.error || "Eroare la trimitere");
      }
    } catch (err) {
      console.error(err);
      setSuccessMessage("Eroare la trimiterea mesajului.");
    }
  };

  return (
    <section className="mx-auto text-gray-200 max-w-[700px] shadow-2xl rounded-2xl">
      {/* Card-uri Contact */}
      {/* Formular */}
      {/* Dialog Mesaj */}
      {/* MapEmbed */}

      <form
        onSubmit={handleSubmit}
        className="bg-slate-200 dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-700 space-y-4"
      >
        <div>
          <label className="text-slate-800 dark:text-slate-50 block text-sm font-medium mb-1">
            Nume
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-2 text-slate-800 dark:text-slate-50 dark:bg-slate-900 border border-gray-700 rounded focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="text-slate-800 dark:text-slate-50 block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 text-slate-800 dark:text-slate-50 bg-slate-100 dark:bg-slate-900 border border-gray-700 rounded focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="text-slate-800 dark:text-slate-50 block text-sm font-medium mb-1">
            Mesaj
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            required
            className="w-full p-2 text-slate-800 dark:text-slate-50 bg-slate-100 dark:bg-slate-900 border border-gray-700 rounded focus:outline-none focus:border-green-500"
          />
        </div>

        {/* Trigger dialog pentru mesaj de succes */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="submit"
              className="text-slate-50 bg-slate-600 hover:bg-slate-700 cursor-pointer transition px-4 py-2 rounded-md w-full"
            >
              TRIMITE MESAJ
            </button>
          </DialogTrigger>

          {successMessage && (
            <DialogContent className="w-[90%] md:w-fit flex flex-col items-center md:!px-16 md:!py-8 !px-6 !py-4">
              <DialogHeader>
                <DialogTitle>Mesaj trimis!</DialogTitle>
              </DialogHeader>
              <p>{successMessage}</p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button ref={closeBtnRef}>Închide</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </form>
    </section>
  );
}
