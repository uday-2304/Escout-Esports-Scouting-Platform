import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";





const app = express();


//some of the major configurations done in express
//configurations are done using app.use()

//for cors
//it says from which all ports/sites the request should be accepted



app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true, // ✅ allow cookies / credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


//the below line limits the incoming data in json format to only be a max of 16 bytes
//applies only if the data is in json format

app.use(express.json({ limit: "16kb" }));

//this line indicates express to read and understand the data
//submitted from the form
// extended:true indicates to read the nested data like
//{ user: { name: "Sumanth", age: "21" } }
//limit is user for limiting the maximum size of the incoming data
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

//cookie-parser
//it lets the express app to read and understand the cookies coming along with the data or user requests
app.use(cookieParser());

// session support (required for the OTP registration flow)
app.use(
  session({
    name: process.env.SESSION_NAME ,
    secret: process.env.SESSION_SECRET ,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);



//routes import

import userRouter from './routes/user.routes.js'
import authRouter from "./routes/authRoutes.js";
import arenaRoutes from "./routes/arenaRoutes.js";
import dashboardVideoRoutes from "./routes/dashboardRoutes.js";

app.use('/api/v1/users', userRouter);
app.use("/api/dashboard", authRouter);
app.use("/api/arena", arenaRoutes);
app.use("/api/dashboard/videos", dashboardVideoRoutes);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


export { app };
