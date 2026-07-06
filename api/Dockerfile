# API SebasPeru — imagen de producción
FROM node:20-alpine
WORKDIR /app

# Instala dependencias primero (mejor cache)
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copia el código
COPY . .

ENV NODE_ENV=production
EXPOSE 4000

# Healthcheck contra /api/health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-4000}/api/health || exit 1

CMD ["node", "src/index.js"]
