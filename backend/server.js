import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

//global middlewares
app.use(express.json());//help to deal with json data
app.use(cookieParser());//cookie-parser reads cookies from the header and adds them to req.cookies

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("server has started http://localhost:" + PORT);
  connectDB();
});

