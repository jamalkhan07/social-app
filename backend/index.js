import express from "express";

import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", authRouter);
app.use("/api/v1", userRouter);

mongoose
  .connect("mongodb://localhost/twitter")
  .then(() => {
    console.log("mongo db is connected successfully..");
  })
  .catch((e) => {
    console.log(e.message);
  });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is runnig on port ${PORT}...`);
});
