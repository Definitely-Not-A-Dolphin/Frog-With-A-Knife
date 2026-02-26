# Make this alpine when pushed
FROM denoland/deno:debian

WORKDIR /app

COPY . .

RUN deno install

CMD ["deno", "run", "prod"]
