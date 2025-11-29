import AboutSlider from "@/components/AboutSlider";
import ReservationDayPicker from "@/components/ReservationDatePicker";

export const metadata = {
  title: "Despre Cabana D Toplița",
  description:
    "Află povestea Cabanei D, refugiu perfect în munți, pentru relaxare și familie.",
  openGraph: {
    title: "Despre Cabana D Toplița",
    description:
      "Află povestea Cabanei D, refugiu perfect în munți, pentru relaxare și familie.",
    url: "https://cabana-d.ro/about",
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

export default function AboutPage() {
  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 py-10 mt-16 md:mt-28">
      <h1 className="text-5xl md:text-5xl font-greatVibes text-center mb-6">
        Povestea Cabanei D
      </h1>
      <p className="leading-relaxed mb-6 mx-auto text-center font-greatVibes text-2xl md:text-4xl max-w-[90%]">
        Departe de zgomotul orașelor, cabana noastră oferă un refugiu perfect
        pentru familii, grupuri sau oricine are nevoie de relaxare si să respire
        aer curat.
      </p>
      <div className="relative">
        <AboutSlider />
        <div className="mt-8 md:absolute -top-6 right-2 z-9999 mx-auto w-fit ">
          <ReservationDayPicker />
        </div>
      </div>
    </div>
  );
}
