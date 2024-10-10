import "express-async-errors";
import "dotenv/config";
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

const app = express();

import connectDB from "./config/db.config.js";

import notFound from "../src/middlewares/not-found.middleware.js";
import errorHandler from "../src/middlewares/error-handler.middleware.js";
import imagesRouter from "./routes/images.route.js";
import rentRouter from "./routes/rent.route.js";
import userRouter from "./routes/user.route.js";
import carRouter from "./routes/car.route.js";

app.use(cors());

app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

connectDB();

app.use("/api/v1/cars", carRouter);
app.use("/api/v1/rent", rentRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/images", imagesRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
