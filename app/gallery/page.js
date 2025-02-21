import Image from "next/image";

function GalleryPage() {
  return (
    <div>
      <h1 className="mt-20 text-3xl font-bold underline text-center py-4">
        Gallery
      </h1>
      <section className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 p-4">
        {Array(20)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="aspect-[16/9] overflow-hidden rounded-lg relative shadow-[0_0_4px_0] shadow-primary/90"
            >
              <img
                src={`img-${i + 1}.jpeg`}
                className="object-contain w-full"
                alt={`Gallery Image ${i + 1}`}
              />
            </div>
          ))}
      </section>
    </div>
  );
}

export default GalleryPage;
