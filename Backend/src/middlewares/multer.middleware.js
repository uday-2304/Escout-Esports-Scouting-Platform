import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: file.mimetype.startsWith("video")
      ? "dashboard/videos"
      : "dashboard/thumbnails",
    resource_type: "auto",
    // chunk_size: 6000000, // Optional: useful for very large files on slow networks
  }),
});

export const upload = multer({
  storage,
  limits: {
    // ⚠️ CLOUDINARY FREE TIER LIMIT IS 100MB.
    // If you set this higher (e.g., 300MB) without a paid plan, 
    // Cloudinary will reject the upload with a 400 error.
    fileSize: 100 * 1024 * 1024, 
  },
});