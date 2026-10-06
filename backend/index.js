import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoute.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use("/", authRouter);

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
