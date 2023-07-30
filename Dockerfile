FROM node:18.16 AS frontend_builder

WORKDIR /frontend

ARG VITE_PUBLIC_CLERK_SIGN_IN_URL
ARG VITE_PUBLIC_CLERK_SIGN_UP_URL
ARG VITE_PUBLIC_CLERK_AFTER_SIGN_IN_URL
ARG VITE_PUBLIC_CLERK_AFTER_SIGN_UP_URL
ARG VITE_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG VITE_PUBLIC_SUPABASE_URL
ARG VITE_PUBLIC_SUPABASE_ANON_KEY

ENV VITE_PUBLIC_CLERK_SIGN_IN_URL=VITE_PUBLIC_CLERK_SIGN_IN_URL
ENV VITE_PUBLIC_CLERK_SIGN_UP_URL=VITE_PUBLIC_CLERK_SIGN_UP_URL
ENV VITE_PUBLIC_CLERK_AFTER_SIGN_IN_URL=VITE_PUBLIC_CLERK_AFTER_SIGN_IN_URL
ENV VITE_PUBLIC_CLERK_AFTER_SIGN_UP_URL=VITE_PUBLIC_CLERK_AFTER_SIGN_UP_URL
ENV VITE_PUBLIC_CLERK_PUBLISHABLE_KEY=VITE_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV VITE_PUBLIC_SUPABASE_URL=VITE_PUBLIC_SUPABASE_URL
ENV VITE_PUBLIC_SUPABASE_ANON_KEY=VITE_PUBLIC_SUPABASE_ANON_KEY

COPY ./frontend/package.json ./frontend/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ./frontend/ ./

RUN yarn build

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11-slim

WORKDIR /

RUN apt-get update && apt-get install -y ffmpeg
RUN apt-get install -y gcc g++ build-essential
RUN apt-get install -y python3-dev
RUN apt-get install -y libpq-dev

COPY ./backend/requirements.txt /tmp/

RUN pip install --no-cache-dir --upgrade -r /tmp/requirements.txt

COPY ./backend /app

COPY --from=frontend_builder /frontend/dist /app/frontend/dist
