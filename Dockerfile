FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --production

# copy code
COPY . .

# create uploads dir
RUN mkdir -p uploads

# expose port
EXPOSE 4000

# start with pm2-runtime for production
CMD ["npx", "pm2-runtime", "ecosystem.config.js", "--env", "production"]
