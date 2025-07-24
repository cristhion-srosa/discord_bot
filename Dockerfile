# Usar uma imagem base do Node.js 20
FROM node:20-alpine

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Copiar o package.json e package-lock.json para o contêiner
COPY package.json ./
COPY package-lock.json ./

# Instalar as dependências do Node.js
RUN npm install -g dotenv discord.js@latest erela.js@2.4.0 erela.js-spotify erela.js-deezer erela.js-apple discord-api-types i18n lodash nodemon
RUN npm install

# Copiar o restante do código do bot para o contêiner
COPY . .

# Expor a porta necessária (se aplicável)
EXPOSE 3000

# Definir o comando de inicialização
CMD ["npm", "start"]