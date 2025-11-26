export default function SuccessPage({ searchParams }) {
  return (
    <div style={{ padding: "40px", textAlign: "center", paddingTop: "120px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Plata a fost efectuată cu succes! 🎉
      </h1>
      <p>Vă mulțumim pentru rezervare.</p>
      <p>Veți primi un email cu detalii în scurt timp.</p>

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
    </div>
  );
}
