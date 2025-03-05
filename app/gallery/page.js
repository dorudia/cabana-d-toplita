import Image from "next/image";
import { getGalleryImages } from "../lib/actions";

async function GalleryPage() {
  const res = await getGalleryImages();
  const allImages = res.map((image) => image?.data);

  return (
    <div>
      <h1 className="mt-20 text-3xl font-bold underline text-center py-4">
        Gallery
      </h1>
      <section className="max-w-7xl mx-auto columns-1 sm:columns-2 md:columns-3 gap-4 p-4">
        {allImages.map(
          (image) =>
            image?.publicUrl && (
              <div
                key={image.publicUrl}
                className="mb-4 break-inside-avoid overflow-hidden rounded-lg relative shadow-[0_0_4px_0] shadow-primary/90"
              >
                <Image
                  src={image.publicUrl}
                  alt="gallery image"
                  width={500} // Lățimea dorită
                  height={300} // Înălțimea dorită (poate fi ajustată automat)
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            )
        )}
      </section>
    </div>
  );
}

export default GalleryPage;
