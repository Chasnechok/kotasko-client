FROM node

WORKDIR /kotasko-client

ENV LOCAL_SERVER_URL=http://server:5000

COPY package.json /kotasko-client

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
