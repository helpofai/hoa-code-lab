import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db/index.js";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.use(cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("HOA Code Lab Server is Running");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("code:update", (data) => {
    socket.broadcast.emit("code:update", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});