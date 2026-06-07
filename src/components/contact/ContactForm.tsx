"use client";

import { FormEvent, useState } from "react";
import { MessageSquare } from "lucide-react";
import { isValidEmail } from "@/lib/contact-validation";
import { aboutBtnPrimary, aboutShadow } from "@/lib/about-tw";

const SUBJECT_OPTIONS = [
  "General Question",
  "Product Suggestion",
  "Content Feedback",
  "Partnership Inquiry",
  "Report an Issue",
  "Other"
] as const;

const inputClass =
  "w-full rounded-2xl border-[1.5px] border-about-border bg-white px-4 py-3 text-[0.92rem] text-about-dark outline-none transition-[border-color,box-shadow] duration-150 focus:border-about-dark";
const inputErrorClass = "border-[#c0432b] shadow-[0_0_0_3px_#fff0ee]";

type FieldErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

type ContactFormProps = {
  defaultEmail?: string;
};

export function ContactForm({ defaultEmail = "" }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function clearFieldError(field: keyof FieldErrors) {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (name.trim().length < 2) {
      next.name = "Please enter your full name (at least 2 characters).";
    }
    if (!email.trim() || !isValidEmail(email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!subject) {
      next.subject = "Please select a topic.";
    }
    if (message.trim().length < 20) {
      next.message = "Message must be at least 20 characters.";
    }
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject,
          message: message.trim()
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setName("");
    setEmail(defaultEmail);
    setSubject("");
    setMessage("");
    setErrors({});
    setSubmitError("");
    setSuccess(false);
  }

  const charCount = message.trim().length;

  if (success) {
    return (
      <div
        className={`overflow-hidden rounded-3xl border border-about-border bg-white px-10 py-12 text-center ${aboutShadow} max-md:px-6`}
      >
        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-about-orange text-white text-2xl font-bold"
          aria-hidden="true"
        >
          ✓
        </div>
        <h3 className="mb-3 text-[1.3rem] font-bold text-about-dark">Message sent!</h3>
        <p className="mb-5 text-[0.95rem] leading-[1.7] text-about-muted">
          Thanks for reaching out. We&apos;ll get back to you within 48 hours.
        </p>
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 text-[0.875rem] font-semibold text-about-orange underline underline-offset-[3px] hover:text-about-orange-hover"
          onClick={resetForm}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-3xl border border-about-border bg-white ${aboutShadow}`}>
      <div className="h-1 bg-gradient-to-r from-about-orange to-about-orange-hover" />

      <div className="px-10 py-10 max-md:px-6 max-md:py-8">
        <div className="mb-7 flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-about-orange-soft text-about-orange"
            aria-hidden="true"
          >
            <MessageSquare size={22} strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="mb-1 text-[1.2rem] font-bold text-about-dark">Send Us a Message</h3>
            <p className="m-0 text-[0.875rem] leading-[1.6] text-about-muted">
              Questions, feedback, or just want to connect? Drop us a note.
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="contact-name"
              className="mb-1.5 block text-[0.85rem] font-semibold text-about-dark"
            >
              Full Name
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearFieldError("name");
              }}
              className={`${inputClass}${errors.name ? ` ${inputErrorClass}` : ""}`}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
            />
            {errors.name ? (
              <span id="contact-name-error" className="mt-1 block text-[0.8rem] text-[#c0432b]" role="alert">
                {errors.name}
              </span>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="mb-1.5 block text-[0.85rem] font-semibold text-about-dark"
            >
              Email Address
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              className={`${inputClass}${errors.email ? ` ${inputErrorClass}` : ""}`}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
            />
            {errors.email ? (
              <span id="contact-email-error" className="mt-1 block text-[0.8rem] text-[#c0432b]" role="alert">
                {errors.email}
              </span>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="contact-subject"
              className="mb-1.5 block text-[0.85rem] font-semibold text-about-dark"
            >
              What&apos;s this about?
            </label>
            <select
              id="contact-subject"
              name="subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                clearFieldError("subject");
              }}
              className={`${inputClass} cursor-pointer appearance-none bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-10${errors.subject ? ` ${inputErrorClass}` : ""}`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236b6b6b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`
              }}
              aria-required="true"
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "contact-subject-error" : undefined}
            >
              <option value="" disabled>
                Select a topic...
              </option>
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.subject ? (
              <span id="contact-subject-error" className="mt-1 block text-[0.8rem] text-[#c0432b]" role="alert">
                {errors.subject}
              </span>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="mb-1.5 block text-[0.85rem] font-semibold text-about-dark"
            >
              Your Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              placeholder="Tell us more..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                clearFieldError("message");
              }}
              className={`${inputClass} resize-y min-h-[120px] leading-[1.6]${errors.message ? ` ${inputErrorClass}` : ""}`}
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby="contact-message-counter contact-message-error"
            />
            <span
              id="contact-message-counter"
              className={`mt-1 block text-[0.8rem] ${charCount >= 20 ? "text-about-orange" : "text-[#c0432b]"}`}
              aria-live="polite"
            >
              {charCount} / 20 minimum characters
            </span>
            {errors.message ? (
              <span id="contact-message-error" className="mt-1 block text-[0.8rem] text-[#c0432b]" role="alert">
                {errors.message}
              </span>
            ) : null}
          </div>

          <button
            type="submit"
            className={`${aboutBtnPrimary} w-full justify-center py-3.5${loading ? " animate-pulse" : ""}`}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Sending..." : "Send Message →"}
          </button>

          {submitError ? (
            <p className="m-0 text-center text-[0.875rem] text-[#c0432b]" role="alert" aria-live="polite">
              {submitError}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
