import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "@/lib/contact-validation";

// TODO: replace with your actual Brevo API key and contact list ID in .env.local
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_CONTACT_LIST_ID = process.env.BREVO_CONTACT_LIST_ID;

// Simple in-memory rate limit — swap for Redis/Upstash in production
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

function splitName(fullName: string): { firstName: string; lastName?: string } {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? fullName;
  const lastName = parts.slice(1).join(" ");
  return lastName ? { firstName, lastName } : { firstName };
}

type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  if (!BREVO_API_KEY || !BREVO_CONTACT_LIST_ID) {
    return NextResponse.json(
      { error: "Contact form is not configured. Please try again later." },
      { status: 503 }
    );
  }

  const listId = parseInt(BREVO_CONTACT_LIST_ID, 10);
  if (Number.isNaN(listId)) {
    console.error("BREVO_CONTACT_LIST_ID is not a valid integer");
    return NextResponse.json(
      { error: "Contact form is not configured correctly." },
      { status: 503 }
    );
  }

  let body: ContactBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const subject = body.subject?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (name.length < 2) {
    return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!subject || subject === "Select a topic...") {
    return NextResponse.json({ error: "Please select a topic." }, { status: 400 });
  }
  if (message.length < 20) {
    return NextResponse.json(
      { error: "Message must be at least 20 characters." },
      { status: 400 }
    );
  }

  const { firstName, lastName } = splitName(name);

  const attributes: Record<string, string> = {
    FULLNAME: name,
    FIRSTNAME: firstName,
    WHAT_THIS_ABOUT: subject,
    MESSAGE: message
  };
  if (lastName) {
    attributes.LASTNAME = lastName;
  }

  const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      attributes,
      listIds: [listId],
      updateEnabled: true
    })
  });

  if (!brevoRes.ok) {
    const errBody = await brevoRes.json().catch(() => ({}));
    console.error("Brevo contact save failed:", brevoRes.status, errBody);
    return NextResponse.json(
      { error: "Something went wrong saving your message. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
