// import Image from "next/image";
// import { getGalleryImages } from "../lib/actions";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../../@/components/ui/dialog";
// import GalleryClient from "../../components/GalleryClient";
// // import { VizuallyHidden } from "../../@/components/ui/vizually-hidden";
// // import { VizuallyHidden } from "radix-ui";

// async function GalleryPage() {
//   const res = await getGalleryImages();
//   const allImages = res.map((image) => image?.data);

//   return (
//     <div>
//       <h1 className="mt-20 text-3xl font-bold underline text-center py-4">
//         Gallery
//       </h1>
//       <section className="max-w-7xl mx-auto columns-1 sm:columns-2 md:columns-3 gap-4 p-4">
//         {allImages.map(
//           (image) => image?.publicUrl && <GalleryClient image={image} />
//         )}
//         <div className="border border-primary/50 w-full aspect-[16/9] rounded-lg p-6 font-greatVibes text-4xl text-center">
//           <h1>Cabana D Toplita</h1>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default GalleryPage;

import GalleryClient from "../../components/GalleryClient";
import { getGalleryImages } from "../../lib/getFromCloudinary";

async function GalleryPage() {
  // const res = await getGalleryImages();
  // const allImages = res.map((image) => image?.data);
  const allImages = await getGalleryImages("cabana-d");

  return <GalleryClient images={allImages} />;
}

export default GalleryPage;
