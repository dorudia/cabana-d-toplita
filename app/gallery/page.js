import { Suspense } from "react";
import GalleryClient from "../../components/GalleryClient";
import { getGalleryImages } from "../../lib/getFromCloudinary";

export const metadata = {
  title: "Galerie Cabana D Toplița - Poze Cabana și Natură",
  description:
    "Vezi poze cu cabana D, interior, exterior și peisajele minunate din Toplița.",
};

async function GalleryPage() {
  // const res = await getGalleryImages();
  // const allImages = res.map((image) => image?.data);
  const allImages = await getGalleryImages("cabana-d");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GalleryClient images={allImages} />;
    </Suspense>
  );
}

export default GalleryPage;
