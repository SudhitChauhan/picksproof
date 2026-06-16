import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { getCloudinaryConfig, isCloudinaryConfigured } from "./config";
import { isCloudinaryImageUrl, isHttpsImageSource } from "./urls";

export { isCloudinaryImageUrl, isHttpsImageSource } from "./urls";

function configureCloudinary() {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true
  });

  return { cloudinary, folder: config.productFolder };
}

function uploadOptions() {
  const config = getCloudinaryConfig();
  return {
    folder: config?.productFolder ?? "picksproof/products",
    resource_type: "image" as const,
    overwrite: false,
    unique_filename: true
  };
}

export async function uploadImageFromUrl(remoteUrl: string): Promise<string> {
  const { cloudinary: cld } = configureCloudinary();

  const result = (await cld.uploader.upload(remoteUrl, uploadOptions())) as UploadApiResponse;
  return result.secure_url;
}

export async function uploadImageFromBuffer(buffer: Buffer, filename?: string): Promise<string> {
  const { cloudinary: cld } = configureCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      {
        ...uploadOptions(),
        ...(filename ? { public_id: filename.replace(/\.[^.]+$/, "") } : {})
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }

        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}

/** Upload remote URLs to Cloudinary; keep existing Cloudinary URLs as-is. */
export async function ensureProductImageUrl(source: string | null | undefined): Promise<string> {
  const trimmed = source?.trim() ?? "";
  if (!trimmed) return "";
  if (isCloudinaryImageUrl(trimmed)) return trimmed;

  if (!isHttpsImageSource(trimmed)) {
    throw new Error("Product image must be a valid https URL or an uploaded file.");
  }

  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  return uploadImageFromUrl(trimmed);
}
