import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js"; 
import cors from "cors";
import path from "path";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Derive __dirname for ES Modules
const __dirname = path.resolve();

// Middleware for CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allow Vite dev server during development
    credentials: true,
  })
);

// Global Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser()); // Adds cookies to req.cookies

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Serve static files from the React app (Vite `dist` folder)
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}
// Server Listening

app.listen(PORT, () => {
  console.log("Server has started: http://localhost:" + PORT);
  connectDB();
});
