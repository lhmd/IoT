# 阶段 1: 构建
FROM node:latest as build
WORKDIR /app
ENV NODE_OPTIONS=--openssl-legacy-provider
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# 阶段 2: 运行
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# COPY /app/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

