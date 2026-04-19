// Cloudinary Configuration
// ========================
// 1. Create a free account at https://cloudinary.com
// 2. Go to Settings → Upload → Add Upload Preset
// 3. Set "Signing Mode" to "Unsigned"
// 4. Copy your Cloud Name from the Dashboard
// 5. Set both values in your .env file:
//
//    VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
//    VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Upload a file to Cloudinary using an unsigned upload preset.
 * Returns the secure URL of the uploaded image.
 * 
 * @param file - The File object to upload
 * @param folder - Optional folder name to organize uploads (e.g. "gallery", "projects")
 * @returns The secure URL string of the uploaded image
 */
export const uploadToCloudinary = async (
  file: File,
  folder: string = "tech-hub"
): Promise<string> => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || "Upload failed");
  }

  const data = await response.json();
  return data.secure_url;
};
