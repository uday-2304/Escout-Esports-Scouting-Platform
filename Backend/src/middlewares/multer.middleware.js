import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: file.mimetype.startsWith("video")
      ? "dashboard/videos"
      : "dashboard/thumbnails",

    resource_type: "auto",        // ✅ FIX
    chunk_size: 6 * 1024 * 1024,  // ✅ Prevent ECONNRESET
    use_filename: true,
    unique_filename: true,
  }),
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 300 * 1024 * 1024, // 300MB
  },
});
