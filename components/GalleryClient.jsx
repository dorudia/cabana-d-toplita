"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogClose } from "../@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function GalleryClient({ images }) {
  const [currentIndex, setCurrentIndex] = useState(null);

  const closeDialog = () => setCurrentIndex(null);
  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  // JSON-LD Schema pentru SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Galerie Cabana D Toplița",
    description: "Galerie cu poze de la cabana D: interior, exterior și natură",
    url: "https://cabana-d.ro/gallery",
    image: images.map((src, i) => ({
      "@type": "ImageObject",
      url: src,
      name: `Cabana D Toplița - imagine ${i + 1}`,
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Galerie */}
      <section className="max-w-7xl mt-14 md:mt-32 mx-auto columns-1 sm:columns-2 md:columns-3 gap-4 p-4 space-y-4">
        {images.map((src, i) => (
          <div
            key={src}
            className="cursor-pointer bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            onClick={() => setCurrentIndex(i)}
          >
            <Image
              src={src + "?fm=webp&w=800"} // WebP optimizat
              alt={`Cabana D Toplița - imagine ${i + 1}`}
              width={500}
              height={300}
              loading="lazy"
              placeholder="blur"
              blurDataURL={src + "?w=10&blur=200"} // tiny blur real -> gri uniform
              className="rounded-lg object-cover"
              quality={75}
            />
          </div>
        ))}
      </section>

      {/* Lightbox / Dialog */}
      {currentIndex !== null && (
        <Dialog open={true} onOpenChange={closeDialog}>
          <DialogContent className="h-[90%] max-w-[90%] aspect-video relative flex items-center justify-center bg-gray-200">
            <DialogTitle className="hidden">Slide</DialogTitle>
            <Image
              src={images[currentIndex] + "?fm=webp&w=1600"}
              alt={`Cabana D Toplița - slide ${currentIndex + 1}`}
              fill
              className="object-contain"
              placeholder="blur"
              blurDataURL={images[currentIndex] + "?w=10&blur=200"}
            />

            {/* Prev / Next */}
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 transition p-2 rounded-full"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 transition p-2 rounded-full"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Close */}
            <DialogClose className="absolute top-4 right-4">
              <span className="bg-primary text-secondary px-3 py-1 rounded-md text-sm shadow-md hover:bg-primary/80 transition">
                Close
              </span>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
