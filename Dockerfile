FROM keymetrics/pm2:8-alpine as builder
MAINTAINER  zhouyu muyu.zhouyu@outlook.com
COPY src src/
COPY test test/
COPY config config/
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY index.js .
RUN npm install
RUN npm run build

FROM keymetrics/pm2:8-alpine
MAINTAINER zhouyu muyu.zhouyu@outlook.com 
COPY --from=builder dist dist/
COPY --from=builder config config/
COPY --from=builder node_modules node_modules/
COPY --from=builder index.js .
ENTRYPOINT pm2-runtime node -r tsconfig-paths/register index.js