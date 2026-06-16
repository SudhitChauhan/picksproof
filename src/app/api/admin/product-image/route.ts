import { NextResponse } from "next/server";
import { ensureProductImageUrl, uploadImageFromBuffer } from "@/lib/cloudinary/upload";
import { isCloudinaryConfigured } from "@/lib/cloudinary/config";
import { isAdminUser } from "@/lib/supabase/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

async function assertAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user)) {
    return null;
  }

  return user;
}

export async function POST(request: Request) {
  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
      },
      { status: 503 }
    );
  }

  const user = await assertAdmin();
  if (!user) {
    return NextResponse.json({ ok: false, message: "Admin access required." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const remoteUrl = formData.get("url");

    if (file instanceof File && file.size > 0) {
      if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
          { ok: false, message: "Upload a JPEG, PNG, WebP, GIF, or AVIF image." },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ ok: false, message: "Image must be 8 MB or smaller." }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const url = await uploadImageFromBuffer(buffer, file.name);
      return NextResponse.json({ ok: true, url });
    }

    if (typeof remoteUrl === "string" && remoteUrl.trim()) {
      const url = await ensureProductImageUrl(remoteUrl.trim());
      return NextResponse.json({ ok: true, url });
    }

    return NextResponse.json(
      { ok: false, message: "Provide an image file or a remote https image URL." },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Could not upload image." },
      { status: 500 }
    );
  }
}
