export default function CancelPage() {
  return (
    <div style={{ padding: 40, textAlign: "center", paddingTop: 120 }}>
      <h1 className="text-2xl mb-4">Plata a fost anulată ❌</h1>
      <p>Rezervarea nu a fost confirmată.</p>
      <p>Dacă vrei, poți încerca din nou.</p>
      <a
        href="/"
        style={{
          display: "inline-block",
          marginTop: 20,
          padding: "10px 20px",
          border: "1px solid #8",
          borderRadius: 8,
          textDecoration: "none",
        }}
      >
        Înapoi la prima pagină
      </a>
    </div>
  );
}
