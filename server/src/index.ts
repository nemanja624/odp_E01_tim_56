// server/src/index.ts
import http from "http";
import app from "./app.js"; // ⬅ obavezno .js ekstenzija u ESM
import { fileURLToPath } from "url";
import path from "path";

// __dirname i __filename za ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Kreiramo HTTP server na osnovu app-a iz app.ts
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running ✅  http://localhost:${PORT}`);
});
