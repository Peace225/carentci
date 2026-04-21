FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

COPY . .

EXPOSE 8080

ENV NODE_ENV=production

CMD ["node", "backend/server.js"]
