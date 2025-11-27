"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const [message, setMessage] = useState("Se confirmă rezervarea...");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    async function confirmReservation() {
      if (!sessionId) return setMessage("session_id lipsă");

      try {
        const res = await fetch("/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        setMessage(data.error || "Rezervarea a fost confirmată! 🎉");
      } catch (err) {
        setMessage(`Eroare: ${err.message}`);
      }
    }

    confirmReservation();
  }, [sessionId]);

  return (
    <div style={{ padding: "40px", textAlign: "center", paddingTop: "120px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>{message}</h1>
      {!message.includes("Se confirmă") && (
        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: "30px",
            padding: "10px 20px",
            border: "1px solid #888",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Înapoi la prima pagină
        </a>
      )}
    </div>
  );
}
