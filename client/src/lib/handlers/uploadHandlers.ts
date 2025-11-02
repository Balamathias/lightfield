import apiClient from "../api/client";

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  url: string;
  format: string;
  width: number;
  height: number;
}

/**
 * Upload image to Cloudinary via backend API
 */
export const uploadImage = async (file: File, folder: string = 'lightfield'): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const response = await apiClient.post<CloudinaryUploadResponse>('/upload-image/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.secure_url;
};

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPG, PNG, WEBP, or GIF image.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File is too large. Maximum size is 5MB.',
    };
  }

  return { valid: true };
}
