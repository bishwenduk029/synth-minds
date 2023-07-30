import base64
import json
import time
import logging

from fastapi import FastAPI, UploadFile, BackgroundTasks, Header, Depends, HTTPException, Header, Request, Path
from fastapi.responses import HTMLResponse
from jose import JWTError, jwt
from typing import Optional
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from llm import LanguageModelManager

from llm import llm_manager
from ai import get_completion
from stt import transcribe
from tts import to_speech

import os


supabase_secret = os.environ['SUPABASE_JWT_ACCESS_KEY']
SECRET_KEY = supabase_secret
ALGORITHM = "HS256"

app = FastAPI()
origins = [
    "*",  # React app address
    # any other origins that need access to the API
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logging.basicConfig(level=logging.INFO)


def get_current_user(authorization: Optional[str] = Header(None)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    # if not authorization:
    #     raise credentials_exception
    scheme, token = authorization.split()
    if scheme.lower() != 'bearer':
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[
                             ALGORITHM], options={"verify_aud": False})
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError as e:
        print(e)
        raise credentials_exception


@app.post("/api/inference/{user_id}")
async def infer(audio: UploadFile, background_tasks: BackgroundTasks,
                user_id: str = Path(...,
                                    description="User ID obtained from the path"),
                api_key: str = Header(..., alias='api-key', description="API Key")) -> FileResponse:
    start_time = time.time()

    user_prompt_text = await transcribe(audio)
    new_bot_id = f'{user_id}elf'
    ai_response_text = await get_completion(user_prompt_text, new_bot_id, api_key, True)
    ai_response_audio_filepath = await to_speech(ai_response_text, background_tasks)

    logging.info('total processing time: %s %s',
                 time.time() - start_time, 'seconds')
    return FileResponse(path=ai_response_audio_filepath, media_type="audio/mpeg",
                        headers={"text": _construct_response_header(user_prompt_text, ai_response_text)})


class ChatInput(BaseModel):
    user_message: str
    api_key: str


@app.post("/api/chats")
async def api_process_objective(chat_input: ChatInput, user_id: str = Depends(get_current_user)):
    """
    Process objective and provide guidance
    """
    ai_response_text = await get_completion(chat_input.user_message, user_id, chat_input.api_key,  False)
    return ai_response_text


@app.get("/healthcheck")
async def healthcheck():
    """
    Simple health check endpoint to verify if the service is up and running.
    """
    # You can add more complex health checks here if needed
    return {"status": "ok"}


@app.get("/chats")
async def chats():
    return RedirectResponse(url="/")


@app.get("/bots/{user_id}")
async def bots():
    return RedirectResponse(url="/")


if os.path.isdir("/app/frontend/dist"):
    app.mount("/", StaticFiles(directory="/app/frontend/dist",
              html=True), name="static")


def _construct_response_header(user_prompt, ai_response):
    return base64.b64encode(
        json.dumps(
            [{"role": "user", "content": user_prompt}, {"role": "assistant", "content": ai_response}]).encode(
            'utf-8')).decode("utf-8")
