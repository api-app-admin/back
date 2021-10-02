FROM node:16-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN yarn
ENV SKIP_PRISMA_VERSION_CHECK=true
RUN yarn prisma generate 
RUN yarn build
RUN cp -r ./prisma/schema.prisma ./dist/prisma/
RUN cp -r ./prisma/migrations ./dist/prisma/


FROM node:16-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
RUN yarn install --prod
ENV SKIP_PRISMA_VERSION_CHECK=true
RUN yarn prisma generate
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "./src/index.js"]


