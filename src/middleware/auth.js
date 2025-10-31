// backend/src/middleware/auth.js
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "lore-secret-dev";

export function requireAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "No token provided" });
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || payload.role !== "admin") return res.status(403).json({ error: "Forbidden: admin only" });
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token: " + err.message });
  }
}
