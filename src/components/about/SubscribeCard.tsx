"use client";

import { FormEvent, useState } from "react";
import { aboutBtnPrimary } from "@/lib/about-tw";

export function SubscribeCard() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-[220px] flex-col rounded-[20px] bg-white px-7 py-8 text-left shadow-[0_12px_28px_rgba(28,28,28,0.1)]">
      <h3 className="mb-2.5 text-[1.1rem] font-bold text-about-dark">
        Get the next pick first.
      </h3>
      <p className="mb-6 flex-1 text-[0.92rem] leading-[1.6] text-about-muted">
        A short, no-spam email when we publish a new comparison or buying guide.
      </p>
      {submitted ? (
        <p className="m-auto mb-0 mt-auto text-[0.92rem] font-semibold text-about-orange">
          You&apos;re on the list. We&apos;ll be in touch.
        </p>
      ) : (
        <form className="mt-auto flex flex-col gap-2.5" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email address"
            className="rounded-full border-[1.5px] border-about-border px-[18px] py-3 text-[0.92rem] text-about-dark outline-none transition-[border-color] duration-150 focus:border-about-dark"
          />
          <button type="submit" className={aboutBtnPrimary}>
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
