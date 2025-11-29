import Link from "next/link";
import LogoCabana from "./LogoCabana";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-200 py-6 font-geist ">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Logo / Branding */}
        <div className="mb-4 md:mb-0 lg:min-w-[200px]">
          <Link
            href="/"
            className="text-2xl font-great-vibes hover:opacity-70 transition font-greatVibes"
          >
            Cabana D
          </Link>
        </div>

        {/* Links */}
        <div className="flex space-x-6 mb-4 md:mb-0">
          <Link href="/" className="hover:opacity-70 transition">
            Home
          </Link>
          <Link href="/gallery" className="hover:opacity-70 transition">
            Galerie Foto
          </Link>
          <Link href="/about" className="hover:opacity-70 transition">
            Despre
          </Link>
          <Link href="/contact" className="hover:opacity-70 transition">
            Contact
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-[10px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} Cabana D.</span>
          <span> Toate drepturile rezervate.</span>
        </div>
      </div>
      <div className="mt-3 text-center text-xs text-slate-400 ">
        Site realizat de{" "}
        <Link
          href="https://www.linkedin.com/in/doru-diaconu"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:hover:opacity-70 transition text-xl font-greatVibes mb-1"
        >
          Diaconu Doru
        </Link>
      </div>
    </footer>
  );
}
