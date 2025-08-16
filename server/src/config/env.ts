import dotenv from "dotenv";
dotenv.config();
export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 4000),
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret_change_me",
  COOKIE_NAME: process.env.COOKIE_NAME || "kurshub_token",
  DATABASE_URL: process.env.DATABASE_URL!,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
};
