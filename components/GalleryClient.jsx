// // app/gallery/GalleryClient.jsx (Client Component)
"use client"; // Marchează acest component ca Client Component

// import { useState } from "react";
// import Image from "next/image";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../@/components/ui/dialog";
// import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
// import { Button } from "./ui/button";

// const MyImage = ({ image }) => {
//   const [aspectRatio, setAspectRatio] = useState(1); // Raport de aspect implicit

//   console.log("aspectRatio:", aspectRatio);

//   const handleImageLoad = (event) => {
//     if (event.target && event.target.tagName === "IMG") {
//       const { naturalWidth, naturalHeight } = event.target;
//       setAspectRatio(naturalHeight / naturalWidth);
//     }
//   };

//   return (
//     <div
//       className="mb-4 break-inside-avoid overflow-hidden rounded-lg relative shadow-[0_0_4px_0] shadow-primary/90"
//       style={{
//         position: "relative",
//         // width: "100%",
//         // height: `${500 * aspectRatio}px`,
//       }} // Calculează înălțimea dinamic
//     >
//       <Dialog className="DD w-[90%]">
//         <DialogTrigger asChild className="w-full h-auto">
//           <Image
//             src={image.publicUrl}
//             alt="gallery image"
//             width={500}
//             height={1} // Calculează înălțimea dinamic
//             onLoad={handleImageLoad}
//             className="object-cover h-fit w-fit max-w-full"
//             // loading="lazy"
//             priority
//           />
//         </DialogTrigger>

//         <DialogTitle />
//         <DialogDescription />

//         <DialogContent className="h-[85%] aspect-video">
//           <div className="relative h-80%">
//             <DialogClose className="absolute ddd z-10 right-0">
//               <span className="bg-primary text-secondary px-2 py-1 rounded-md text-xl">
//                 Close
//               </span>
//             </DialogClose>
//             <Image
//               src={image.publicUrl}
//               alt="gallery image"
//               fill
//               //   width={500}
//               //   height={500 * aspectRatio} // Calculează înălțimea dinamic
//               className="object-contain"
//               // onLoad={handleImageLoad}
//               loading="lazy"
//             />
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default function GalleryClient({ images }) {
//   return (
//     <div>
//       <h1 className="mt-20 text-3xl font-bold underline text-center py-4">
//         Gallery
//       </h1>
//       <section className="max-w-7xl mx-auto columns-1 sm:columns-2 md:columns-3 gap-4 p-4">
//         {images.map(
//           (image) =>
//             image?.publicUrl && <MyImage key={image.publicUrl} image={image} />
//         )}
//         <div className="border border-primary/50 w-full aspect-[16/9] rounded-lg p-6 font-greatVibes text-4xl text-center">
//           <h1>Cabana D Toplita</h1>
//         </div>
//       </section>
//     </div>
//   );
// }

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

        <DialogContent className="h-[85%] aspect-video">
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

export default function GalleryClient({ images }) {
  return (
    <div>
      <h1 className="mt-20 text-3xl font-bold underline text-center py-4">
        Gallery
      </h1>
      <section className="max-w-7xl mx-auto columns-1 sm:columns-2 md:columns-3 gap-4 p-4">
        {images.map((src) => (
          <MyImage key={src} src={src} />
        ))}
        <div className="border border-primary/50 w-full aspect-[16/9] rounded-lg p-6 font-greatVibes text-4xl text-center">
          <h1>Cabana D Toplita</h1>
        </div>
      </section>
    </div>
  );
}
