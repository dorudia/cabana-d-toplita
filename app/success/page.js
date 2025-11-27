"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const [message, setMessage] = useState("Se confirmă rezervarea...");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const confirmReservation = async () => {
      try {
        const res = await fetch("/api/webhook", {
          method: "POST",
          body: JSON.stringify({ sessionId }), // trimite sessionId dacă ai
          headers: { "Content-Type": "application/json" },
        });

        let data;
        try {
          data = await res.json(); // încearcă să parsezi JSON
        } catch (err) {
          console.warn("⚠️ Răspuns non-JSON de la server:", err);
          data = null;
        }

        if (res.ok) {
          setMessage("Rezervarea a fost confirmată cu succes!");
        } else {
          setMessage(`Eroare la confirmare: ${data?.error || res.statusText}`);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setMessage("Eroare la comunicarea cu serverul.");
      } finally {
        setLoading(false);
      }
    };

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
