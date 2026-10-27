"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <p className="inline-flex items-center gap-2 rounded-full bg-leaf-500/20 px-5 py-3 text-sm font-semibold text-cream-50">
        <Check className="h-4 w-4 text-caramel-300" /> Teşekkürler! Bültenimize kaydoldunuz.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        E-posta adresiniz
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-posta adresiniz"
        className="h-12 flex-1 rounded-full border border-cream-50/15 bg-cream-50/5 px-5 text-sm text-cream-50 placeholder:text-cream-200/50 focus:border-caramel-400 focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-caramel-500 px-6 text-sm font-bold text-espresso-950 transition-colors hover:bg-caramel-400 disabled:opacity-60"
      >
        Abone ol <ArrowRight className="h-4 w-4" />
      </button>
      {state === "error" && (
        <p className="text-xs text-berry-500 sm:absolute sm:mt-14">Bir sorun oluştu, lütfen tekrar deneyin.</p>
      )}
    </form>
  );
}
