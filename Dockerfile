# ======================
# Build Vite Frontend
# ======================
FROM node:20 AS build-frontend

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ . 
RUN npm run build


# ======================
# Build Node.js Backend
# ======================
FROM node:20 AS build-backend

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# Copy Vite build output into backend public directory
COPY --from=build-frontend /app/frontend/dist ./public


# ======================
# Run Backend
# ======================
EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "server.js"]
