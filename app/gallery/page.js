import GalleryClient from "../../components/GalleryClient";
import { getGalleryImages } from "../../lib/getFromCloudinary";

async function GalleryPage() {
  // const res = await getGalleryImages();
  // const allImages = res.map((image) => image?.data);
  const allImages = await getGalleryImages("cabana-d");

  return <GalleryClient images={allImages} />;
}

export default GalleryPage;
