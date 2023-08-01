from typing import Any, List, Optional
from langchain.agents import tool
from pydantic import BaseModel, Field
from agents.memory import get_bot_second_brain_vecstore
from llama_index import StorageContext
from llama_index.indices.vector_store import VectorStoreIndex
from llama_hub.web.trafilatura_web.base import TrafilaturaWebReader

import os


loader = TrafilaturaWebReader()


def ingest_web(input: str) -> str:
    """Useful for when you need to learn or digest or ingest or memorize new information from remote storage locations or on request of the user."""
    remote_url, user_id = input.rsplit(",", 1)
    new_bot_id = f'{user_id}elf'

    try:
        documents = loader.load_data(url=[remote_url])
    except Exception as e:
        return str(e)


    vec_store = get_bot_second_brain_vecstore(new_bot_id)
    storage_context = StorageContext.from_defaults(vector_store=vec_store)
    VectorStoreIndex.from_documents(documents, storage_context=storage_context)
    env_variable_value = os.environ.get('SYNTH_MINDS_BACKEND_URL')

    if env_variable_value is not None:
        SYNTH_MINDS_BACKEND_URL = env_variable_value
    else:
        print("Environment variable not set.")
    
    result = f"Ingested the document successfully. Your bot ready and you can access it here {SYNTH_MINDS_BACKEND_URL.strip()}/{user_id.strip()}"
    return result
