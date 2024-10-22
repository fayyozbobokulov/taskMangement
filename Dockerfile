# Stage 1: Build the NestJS app
FROM node:20.18.0-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run the app
FROM node:20.18.0-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./
RUN npm install --production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
