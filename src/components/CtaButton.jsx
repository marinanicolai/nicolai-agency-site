import { useEffect, useRef, useState } from "react";

const FORM_ENDPOINT = "https://formspree.io/f/xpwlblay"; // your endpoint

export default function CtaButton({ label = "Get My Free Website Audit" }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      dialogRef.current?.querySelector("input, textarea, button")?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSending(false);
      setError("");
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();                     // <-- stop full-page navigation
    setSending(true);
    setError("");
    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" }, // get JSON response instead of HTML
        body: data,
      });
      if (res.ok) {
        // go to your own thank-you page
        window.location.assign("/thanks");
        return;
      }
      const json = await res.json().catch(() => ({}));
      setError(json?.errors?.[0]?.message || "Something went wrong. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
      >
        {label}
      </button>

      {open && <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} aria-hidden="true" />}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cta-title"
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
      >
        <div
          ref={dialogRef}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        >
          <h2 id="cta-title" className="text-xl font-bold mb-2">Request a Free Website Audit</h2>
          <p className="text-sm text-gray-600 mb-4">Tell me where to send your audit. I’ll review speed, SEO, and UX.</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input name="name" type="text" placeholder="Your name" className="w-full rounded-lg border p-2" required />
            <input name="email" type="email" placeholder="Email" className="w-full rounded-lg border p-2" required />
            <input name="url" type="url" placeholder="Your website URL" className="w-full rounded-lg border p-2" />
            <textarea name="notes" rows="3" placeholder="Notes (optional)" className="w-full rounded-lg border p-2" />

            {/* extras */}
            <input type="hidden" name="_subject" value="Free Website Audit Request" />
            <input type="text" name="_gotcha" className="hidden" tabIndex="-1" autoComplete="off" />

            {error && <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>}

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={sending} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60">
                {sending ? "Sending…" : "Send"}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
