import express from "express";
import { getCreatorsArchive, getPlayersDatabase, getComments, toggleLike, addComment, incrementView } from "../controllers/VideoController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/arena-videos", getCreatorsArchive);

router.get("/players-videos", getPlayersDatabase);
router.get("/:id/comments", getComments);

// Interactions (Protected)
router.put("/:id/like", verifyToken, toggleLike);
router.post("/:id/comment", verifyToken, addComment);

// Views (Public or Protected, strictly speaking anyone can view)
router.put("/:id/view", incrementView);

export default router;