import express from "express";
import { getArenaVideos } from "../controllers/arenaController.js";

const router = express.Router();

router.get("/arena-videos", getArenaVideos);

export default router;
