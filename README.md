# Platforma za online ucenje 

cd server
cp .env.example .env
npm install
npm run db:setup   
npm run dev        

cd client
cp .env.example .env
npm install
npm run dev        # Vite na :5173

