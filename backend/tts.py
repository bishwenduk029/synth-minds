import logging
import os
import time
import uuid

from pydub import AudioSegment
from elevenlabs import generate, save

from util import delete_file

from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.llms import OpenAI

llm = OpenAI(temperature=0, model_name="gpt-3.5-turbo")

LANGUAGE = os.getenv("LANGUAGE", "en")
AUDIO_SPEED = os.getenv("AUDIO_SPEED", None)
TTS_PROVIDER = os.getenv("TTS_PROVIDER", "EDGETTS")

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", None)
ELEVENLABS_VOICE = os.getenv("ELEVENLABS_VOICE", "rJ83wT4e057MKGFFhb9e")
EDGETTS_VOICE = os.getenv("EDGETTS_VOICE", "en-US-EricNeural")


async def to_speech(text, background_tasks):
    if TTS_PROVIDER == "ELEVENLABS":
        return _elevenlabs_to_speech(text, background_tasks)
    else:
        raise ValueError(
            f"env var TTS_PROVIDER set to unsupported value: {TTS_PROVIDER}")


def _elevenlabs_to_speech(text, background_tasks):
    start_time = time.time()

    prompt = PromptTemplate(
        input_variables=["body"],
        template="""
    Transform the following virtual assistant responses into more expressive versions, emphasizing the embedded emotion through extended words, laughter, or other phonetic variations where appropriate, while being careful not to include inappropriate phonetics, such as laughter in serious contexts:

    Input: "I am absolutely thrilled because our team won the match."
    Output: "Our team won! I'm absoluuuutely ecstatic!"

    Input: "I am pretty upset as our vacation got cancelled."
    Output: "Vacation cancelled... I'm really buuuuuummed out."

    Input: "{body}"
    """,
    )

    chain = LLMChain(llm=llm, prompt=prompt)
    new_text = chain.run(body=text)

    audio = generate(
        api_key=ELEVENLABS_API_KEY,
        text=new_text,
        voice=ELEVENLABS_VOICE,
        model="eleven_monolingual_v1"
    )

    filepath = f"/tmp/{uuid.uuid4()}.mp3"
    save(audio, filepath)

    speed_adjusted_filepath = _adjust_audio_speed(filepath)
    background_tasks.add_task(delete_file, speed_adjusted_filepath)

    logging.info('TTS time: %s %s', time.time() - start_time, 'seconds')
    return speed_adjusted_filepath


def _adjust_audio_speed(audio_filepath):
    if AUDIO_SPEED is None:
        return audio_filepath

    audio = AudioSegment.from_mp3(audio_filepath)
    faster_audio = audio.speedup(playback_speed=float(AUDIO_SPEED))

    speed_adjusted_filepath = f"/tmp/{uuid.uuid4()}.mp3"
    faster_audio.export(speed_adjusted_filepath, format="mp3")

    delete_file(audio_filepath)

    return speed_adjusted_filepath

# // "fastapi-dev": "pip3 install -r requirements.txt && python3 -m uvicorn api.index:app --reload",
