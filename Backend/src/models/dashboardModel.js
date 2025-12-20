import mongoose from "mongoose";

const dashboardVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    game: {
      type: String,
      required: true,
      enum: ["PUBG", "Free Fire", "Valorant", "COD", "Fortnite", "Minecraft"],
    },

    thumbnail: { type: String, required: true },
    videoUrl: { type: String, required: true },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    commentsCount: { type: Number, default: 0 },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const DashboardVideo = mongoose.model(
  "DashboardVideo",
  dashboardVideoSchema
);
