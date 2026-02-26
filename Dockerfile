# Make this alpine when pushed
FROM denoland/deno:alpine

WORKDIR /app

COPY . .

RUN deno install

CMD ["deno", "run", "prod"]
