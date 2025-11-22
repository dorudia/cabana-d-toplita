"use client";

import { useState, useRef } from "react";
import MapEmbed from "../../components/Map";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../../@/components/ui/dialog";
import { Button } from "../../@/components/ui/button";

export default function ContactPage() {
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
    <section className="max-w-5xl mx-auto px-4 py-16 text-gray-200 mt-16">
      {/* CARDURI */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-200 dark:bg-slate-800 shadow-lg rounded-lg p-6">
          <div className="flex items-center mb-2">
            <MapPin className="w-6 h-6 text-primary mr-3" />
            <p className="text-lg text-slate-900 dark:text-slate-50 font-medium">
              Adresă
            </p>
          </div>
          <p className="text-slate-900 dark:text-slate-100 text-sm">
            Str. 1 Decembrie 1918, nr.308/B <br />
            Toplița – Cabana D
          </p>
        </div>

        <div className="bg-slate-200 dark:bg-slate-800 shadow-lg rounded-lg p-6">
          <div className="flex items-center mb-2">
            <Phone className="w-6 h-6 text-primary mr-3" />
            <p className="text-lg text-slate-900 dark:text-slate-50 font-medium">
              Telefon
            </p>
          </div>
          <p className="text-slate-900 dark:text-slate-100 text-sm">
            +40 757 418 580 <br />
            +40 758 098 831
          </p>
        </div>

        <div className="bg-slate-200 dark:bg-slate-800 shadow-lg rounded-lg p-6">
          <div className="flex items-center mb-2">
            <Mail className="w-6 h-6 text-primary mr-3" />
            <p className="text-lg text-slate-900 dark:text-slate-50 font-medium">
              Email
            </p>
          </div>
          <p className="text-slate-900 dark:text-slate-100 text-sm break-all">
            cabana@example.com
          </p>
        </div>
      </div>

      {/* FORMULAR */}
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

      <div className="mt-10">
        <MapEmbed />
      </div>
    </section>
  );
}
