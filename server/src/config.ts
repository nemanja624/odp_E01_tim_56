import dotenv from 'dotenv';
dotenv.config();
export const config = {
  port: Number(process.env.PORT) || 4000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'smart_elearning',
  },
  jwtSecret: process.env.JWT_SECRET || 'changeme',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  uploadDirs: {
    images: 'src/uploads/images',
    materials: 'src/uploads/materials'
  }
};
