import http from "http";
import app from "./app";
import { env } from "./config/env";

const server = http.createServer(app);
server.listen(env.PORT, () => console.log(`API on http://localhost:${env.PORT}`));
