// import { useState, useRef } from "react";
import MapEmbed from "../../components/Map";
import { Mail, Phone, MapPin } from "lucide-react";
import ContactPageForm from "@/components/ContactPageForm";

export const metadata = {
  title: "Contact Cabana D Toplița",
  description:
    "Contactează Cabana D Toplița pentru rezervări sau informații. Telefon, email și hartă.",
  openGraph: {
    title: "Contact Cabana D Toplița",
    description:
      "Contactează Cabana D Toplița pentru rezervări sau informații. Telefon, email și hartă.",
    url: "https://cabana-d.ro/contact",
    siteName: "Cabana D Toplița",
    images: [
      {
        url: "/cabana-dark-1.jpg",
        width: 1200,
        height: 630,
        alt: "Cabana D Toplița",
      },
    ],
    locale: "ro_RO",
    type: "website",
  },
};

export default function ContactPage() {
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
    <section className="max-w-5xl mx-auto px-4 py-16 text-gray-200 mt-6 md:mt-24">
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
            dorudia@gmail.com
          </p>
        </div>
      </div>

      {/* FORMULAR */}
      <ContactPageForm />

      <div className="mt-10">
        <MapEmbed />
      </div>
    </section>
  );
}
