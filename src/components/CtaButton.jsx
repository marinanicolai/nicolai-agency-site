import { useState } from "react";

export default function CtaButton({ label = "Book a Free Audit" }) {
  const [clicked, setClicked] = useState(false);
  return (
    <button
      onClick={() => setClicked(true)}
      className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
    >
      {clicked ? "Thanks! We'll contact you soon." : label}
    </button>
  );
}
