import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addDashboardVideo,
  getMyDashboardVideos,
  deleteDashboardVideo,
  toggleLike,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  addDashboardVideo
);

router.get("/", verifyToken, getMyDashboardVideos);
router.delete("/:id", verifyToken, deleteDashboardVideo);
router.put("/:id/like", verifyToken, toggleLike);

export default router;