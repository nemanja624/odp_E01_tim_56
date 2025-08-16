# KursHub — uputstvo za pokretanje (dev)

## Prerekviziti
- Node 20+
- MySQL 8+ (ili `docker-compose up -d`)

## Backend
cd server
npm i
npx prisma generate
npx prisma migrate dev --name init
npm run seed  # "ts-node src/db/seed.ts" u package.json
npm run dev   # "ts-node-dev src/index.ts"

## Frontend
cd client
npm i
npm run dev   # Vite na 5173

## Login demo nalozi (posle seeda)
- Profesor: prof@fakultet.rs / password
- Student:  student@fakultet.rs / password
