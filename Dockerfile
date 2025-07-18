# ======================
# Build React Frontend
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
COPY backend/ .

# Copy React build to backend's public directory (or adjust based on your backend config)
COPY --from=build-frontend /app/frontend/build ./public


# ======================
# Run Backend
# ======================
EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "index.js"]
