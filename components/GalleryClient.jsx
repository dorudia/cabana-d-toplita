"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../@/components/ui/dialog";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const MyImage = ({ src }) => {
  const [aspectRatio, setAspectRatio] = useState(1);

  const handleImageLoad = (event) => {
    if (event.target && event.target.tagName === "IMG") {
      const { naturalWidth, naturalHeight } = event.target;
      setAspectRatio(naturalHeight / naturalWidth);
    }
  };

  return (
    <div className="mb-4 break-inside-avoid overflow-hidden rounded-lg relative shadow-[0_0_4px_0] shadow-primary/90">
      <Dialog className="DD w-[90%]">
        <DialogTrigger asChild className="w-full h-auto">
          <Image
            src={src}
            alt="gallery image"
            width={500}
            height={1} // înălțimea calculată dinamic
            onLoad={handleImageLoad}
            className="object-cover h-fit w-fit max-w-full"
            priority
          />
        </DialogTrigger>

        <DialogTitle />
        <DialogDescription />

        <DialogContent className="h-[85%] max-w-[90%] aspect-video">
          <div className="relative h-80%">
            <DialogClose className="absolute z-10 right-0">
              <span className="bg-primary text-secondary px-2 py-1 rounded-md text-xl">
                Close
              </span>
            </DialogClose>
            <Image
              src={src}
              alt="gallery image"
              fill
              className="object-contain"
              loading="lazy"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// export default function GalleryClient({ images }) {
//   return (
//     <div>
//       {/* <h1 className="mt-28 text-3xl font-bold text-center py-4">Gallery</h1> */}
//       <section className="max-w-7xl mt-14 md:mt-32 mx-auto columns-1 sm:columns-2 md:columns-3 gap-4 p-4">
//         {images.map((src) => (
//           <MyImage key={src} src={src} />
//         ))}
//         <div className="border border-primary/50 w-full aspect-[16/9] rounded-lg p-6 font-greatVibes text-4xl text-center">
//           <h1>Cabana D Toplita</h1>
//         </div>
//       </section>
//     </div>
//   );
// }

export default function GalleryClient({ images }) {
  const [currentIndex, setCurrentIndex] = useState(null);

  const closeDialog = () => setCurrentIndex(null);
  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div>
      <section className="max-w-7xl mt-14 md:mt-32 mx-auto columns-1 sm:columns-2 md:columns-3 gap-4 p-4 space-y-4">
        {images.map((src, i) => (
          <div
            key={src}
            className="cursor-pointer"
            onClick={() => setCurrentIndex(i)}
          >
            <Image
              src={src}
              alt=""
              width={500}
              height={300}
              className="rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
            />
          </div>
        ))}
      </section>

      {currentIndex !== null && (
        <Dialog open={true} onOpenChange={closeDialog}>
          <DialogContent className="h-[90%] max-w-[90%] aspect-video relative flex items-center justify-center">
            <DialogTitle className="hidden">Slide</DialogTitle>
            <Image
              src={images[currentIndex]}
              alt="slide image"
              fill
              className="object-contain"
            />

            {/* butoane slide */}
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

            {/* close */}
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
