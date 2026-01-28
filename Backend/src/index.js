import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });

    // 🟢 CRITICAL FIX: Increase Timeout to 10 Minutes (600000ms)
    // This prevents the server from cutting off large video uploads
    server.setTimeout(600000);
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });