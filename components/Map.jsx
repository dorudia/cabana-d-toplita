"use client";

export default function MapEmbed() {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <iframe
        src="https://www.google.com/maps?q=46.968968,25.405019&z=19&output=embed"
        width="100%"
        height="100%"
        allowFullScreen=""
        loading="lazy"
      ></iframe>
    </div>
  );
}
