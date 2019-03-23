FROM node:9.11.1

RUN mkdir -p /home/tlgc

WORKDIR /home/tlgc

COPY package.json /home/tlgc

RUN npm install --production --registry=https://registry.npm.taobao.org

COPY . /home/tlgc

EXPOSE 7001
# 就在 docker 里面跑 egg-scripts start 即可，不需要 --daemon 了。
CMD npm run docker