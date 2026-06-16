export type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  productFolder: string;
};

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
    productFolder: process.env.CLOUDINARY_PRODUCT_FOLDER?.trim() || "picksproof/products"
  };
}

export function isCloudinaryConfigured(): boolean {
  return getCloudinaryConfig() !== null;
}
