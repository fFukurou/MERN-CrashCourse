import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// middleware
// cors is only needed in development:
if (process.env.NDOE_ENV !== "production") {
  app.use(
    cors({
      origin: ["http://localhost:5173"],
    })
  );
}
app.use(express.json()); // parses JSON bodies
app.use(rateLimiter);

// app.use((req, res, next) => {
//   console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//   next();
// });

app.use("/api/notes", notesRoutes);

// if we are in production:
if (process.env.NODE_ENV === "production") {
  // we are gonna put a path here for the frontend dist folder;
  // serve this application as a static assset;
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // if you get anything, other than our /api/notes, serve our frontend application;
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on PORT: 5001`);
  });
});
