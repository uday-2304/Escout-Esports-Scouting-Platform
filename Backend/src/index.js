import dotenv from "dotenv"; // forced restart
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})

connectDB()
    .then(() => {
        const server = app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
            console.log("✅ SERVER RESTARTED WITH LATEST CODE (Step Id 228)");
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })