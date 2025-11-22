// /components/emails/ContactEmail.jsx
export default function ContactEmail({ name, email, message }) {
  return (
    <div style={{ fontFamily: "sans-serif", lineHeight: "1.5" }}>
      <h2>Mesaj de la {name}</h2>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Mesaj:</strong>
      </p>
      <p>{message}</p>
    </div>
  );
}
