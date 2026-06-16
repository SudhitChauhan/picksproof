type UploadResult = { ok: true; url: string } | { ok: false; message: string };

export async function uploadProductImageToCloudinary(input: {
  file?: File;
  url?: string;
}): Promise<UploadResult> {
  const formData = new FormData();

  if (input.file) {
    formData.append("file", input.file);
  } else if (input.url?.trim()) {
    formData.append("url", input.url.trim());
  } else {
    return { ok: false, message: "Choose a file or enter an image URL." };
  }

  const response = await fetch("/api/admin/product-image", {
    method: "POST",
    body: formData
  });

  const data = (await response.json()) as UploadResult;

  if (!response.ok || !data.ok) {
    return {
      ok: false,
      message: data.ok ? "Upload failed." : data.message
    };
  }

  return data;
}
