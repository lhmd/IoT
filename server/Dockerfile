# 后端 Dockerfile

FROM node:latest

WORKDIR /app

# 复制 package.json 和 package-lock.json 并安装依赖
COPY server/package.json server/package-lock.json ./
RUN npm install

# 复制后端应用的代码
COPY server/ ./

# 复制 wait-for-it.sh 脚本
COPY scripts/wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh

EXPOSE 3400

# 启动命令
CMD ["./wait-for-it.sh", "mysql:3306", "--", "sh", "-c", "sleep 30 && node app.js"]

