"use client";
import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="h-[calc(100vh-280px)] mt-36 text-center">
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Plata a fost anulată ❌
      </h1>
      <p>Dacă vrei, poți încerca din nou sau reveni pe homepage.</p>
      <button
        onClick={() => router.push("/")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Înapoi la homepage
      </button>
    </div>
  );
}
