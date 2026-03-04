FROM denoland/deno:latest

WORKDIR /app

COPY . .

RUN deno install

CMD ["deno", "run", "prod"]
