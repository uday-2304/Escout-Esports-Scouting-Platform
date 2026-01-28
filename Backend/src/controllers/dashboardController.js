import { DashboardVideo } from "../models/dashboardModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

/* ================= ADD VIDEO ================= */
export const addDashboardVideo = asyncHandler(async (req, res) => {
  const { title, game } = req.body;

  // 🛡️ SAFE CHECK: Ensure files exist before accessing [0].path
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  const videoLocalPath = req.files?.video?.[0]?.path;

  if (!title || !game) {
    throw new ApiError(400, "Title and Game fields are required");
  }

  if (!thumbnailLocalPath || !videoLocalPath) {
    throw new ApiError(400, "Both Thumbnail and Video files are required");
  }

  const video = await DashboardVideo.create({
    title,
    game,
    thumbnail: thumbnailLocalPath, // Cloudinary URL from multer-storage
    videoUrl: videoLocalPath,      // Cloudinary URL from multer-storage
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    video,
  });
});

/* ================= GET VIDEOS ================= */
export const getMyDashboardVideos = asyncHandler(async (req, res) => {
  const videos = await DashboardVideo.find({
    owner: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    videos,
  });
});

/* ================= DELETE VIDEO ================= */
export const deleteDashboardVideo = asyncHandler(async (req, res) => {
  const video = await DashboardVideo.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  await video.deleteOne();

  res.status(200).json({
    success: true,
    message: "Video deleted",
  });
});

/* ================= LIKE / UNLIKE ================= */
export const toggleLike = asyncHandler(async (req, res) => {
  const video = await DashboardVideo.findById(req.params.id);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const userId = req.user._id.toString();

  const index = video.likes.findIndex((id) => id.toString() === userId);

  if (index !== -1) {
    video.likes.splice(index, 1); // Unlike
  } else {
    video.likes.push(userId); // Like
  }

  await video.save();

  res.status(200).json({
    success: true,
    likes: video.likes.length,
  });
});