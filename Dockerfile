FROM oven/bun:1.1

WORKDIR /project
COPY package.json bun.lockb ./
RUN bun install
