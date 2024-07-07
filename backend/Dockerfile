FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ENV PORT=3000

ENV DATABASE_URI="mongodb+srv://puffcatz24:pnh0ePn6Bsd80oFH@habify.cpqaqm6.mongodb.net/habify?retryWrites=true&w=majority&appName=habify"

ENV ACCESS_TOKEN="7d873563ac25bdd4e20c3b395d5a3dfb39cbd313de5bea4c155ae12fbf9fe444"

ENV REFRESH_TOKEN="97d7fb869b0073933d1218a99703f512a29ac4a3d0af72b11b42270de8a775b8"

EXPOSE 3000

CMD ["npm", "start"]


