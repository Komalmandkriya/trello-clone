const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only JPG, PNG or WEBP images are allowed";
  }

  if (file.size > MAX_SIZE_BYTES) {
    return "Image must be smaller than 5MB";
  }

  return null;
}
