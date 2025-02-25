import cookieParser from "cookie-parser";
import express from "express";
import connectDB from "./database/connectDB.js";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import fileUpload from "express-fileupload";

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Enable file upload middleware (required for Cloudinary uploads)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Use your authentication routes (your authenticator middleware remains in your middleware folder)
app.use("/api/auth", authRoutes);

const PORT = 4040;
app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
