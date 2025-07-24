# Usar uma imagem base do OpenJDK 17
FROM openjdk:17-jdk-slim

# Definir o diretório de trabalho
WORKDIR /app

# Baixar o arquivo Lavalink.jar
RUN apt-get update && \
    apt-get install -y wget gettext && \
    apt-get clean && \
    wget https://github.com/davidffa/lavalink/releases/download/v1.2.10/Lavalink.jar

# Copiar o arquivo de configuração para o contêiner
COPY application.yml /app/application.yml

# Expor a porta necessária
EXPOSE 2333

# Definir o comando de inicialização
CMD ["sh", "-c", "envsubst < /app/application.yml > /app/application_env.yml && exec java -jar Lavalink.jar"]