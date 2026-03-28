FROM node:20-alpine

WORKDIR /app

COPY server/package.json ./server/
RUN cd server && npm install --omit=dev

COPY server ./server
COPY public ./public

WORKDIR /app/server
EXPOSE 3000
CMD ["node", "src/app.js"]
