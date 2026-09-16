import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  // Ensure persistent data directory exists
  const DATA_DIR = path.join(process.cwd(), "data");
  const DB_FILE = path.join(DATA_DIR, "portfolio-db.json");

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // --- API Endpoints ---
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });

  // Get portfolio data
  app.get("/api/portfolio", (_req, res) => {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        return res.json({
          success: true,
          data: parsed.data,
          updatedAt: parsed.updatedAt || 0,
        });
      }
      return res.json({
        success: true,
        data: null,
        updatedAt: 0,
      });
    } catch (err: any) {
      console.error("Error reading portfolio data:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Save/Update portfolio data (Called when admin adds, edits or deletes any project/data)
  app.post("/api/portfolio", (req, res) => {
    try {
      const { data } = req.body;
      if (!data || typeof data !== "object") {
        return res.status(400).json({ success: false, error: "Invalid portfolio data payload" });
      }

      const payload = {
        data,
        updatedAt: Date.now(),
      };

      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(payload, null, 2), "utf-8");
      fs.renameSync(tempFile, DB_FILE);

      console.log(`[CMS Sync] Portfolio data successfully saved at ${new Date(payload.updatedAt).toISOString()}`);
      return res.json({
        success: true,
        updatedAt: payload.updatedAt,
      });
    } catch (err: any) {
      console.error("Error saving portfolio data:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Lightweight version check for clients/mobiles to poll
  app.get("/api/portfolio/version", (_req, res) => {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        return res.json({ updatedAt: parsed.updatedAt || 0 });
      }
      return res.json({ updatedAt: 0 });
    } catch {
      return res.json({ updatedAt: 0 });
    }
  });

  // Reset portfolio to initial defaults
  app.post("/api/portfolio/reset", (_req, res) => {
    try {
      if (fs.existsSync(DB_FILE)) {
        fs.unlinkSync(DB_FILE);
      }
      return res.json({ success: true, updatedAt: Date.now() });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- Vite Dev Middleware or Production Static Serving ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
