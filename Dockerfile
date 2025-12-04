FROM node:20-alpine

WORKDIR /usr/src/app
# ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --only=production; else npm install --production; fi

COPY --chown=node:node . .

USER node

EXPOSE 3000

# Start the app using package.json "start" script
CMD ["npm", "start"]from node:20-alpine
 