FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11-slim

WORKDIR /

RUN apt-get update && apt-get install -y ffmpeg
RUN apt-get install -y gcc g++ build-essential
RUN apt-get install -y python3-dev
RUN apt-get install -y libpq-dev

COPY ./backend/requirements.txt /tmp/

RUN pip install --no-cache-dir --upgrade -r /tmp/requirements.txt

COPY ./backend /app
