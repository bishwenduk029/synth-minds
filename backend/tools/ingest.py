from typing import Any, List, Optional
from langchain.agents import tool
from pydantic import BaseModel, Field
from agents.memory import get_bot_second_brain_vecstore
from llama_index import StorageContext
from llama_index.indices.vector_store import VectorStoreIndex
from llama_hub.remote.base import RemoteReader

import os

# Function to read environment variables and make them global


def read_and_set_env_variable():
    global SYNTH_MINDS_BACKEND_URL  # Declare the variable as global

    # Replace 'YOUR_ENV_VARIABLE_NAME' with the actual name of your environment variable
    env_variable_value = os.environ.get('SYNTH_MINDS_BACKEND_URL')

    if env_variable_value is not None:
        SYNTH_MINDS_BACKEND_URL = env_variable_value
    else:
        print("Environment variable not set.")


loader = RemoteReader()


def ingest(input: str) -> str:
    """Useful for when you need to learn or digest or ingest or memorize new information from remote locations or on request of the user."""
    remote_url, user_id = input.rsplit(",", 1)
    documents = loader.load_data(url=remote_url)
    vec_store = get_bot_second_brain_vecstore(user_id)
    storage_context = StorageContext.from_defaults(vector_store=vec_store)
    VectorStoreIndex.from_documents(documents, storage_context=storage_context)
    result = f"Ingested the document successfully. Your bot ready and you can access it here {SYNTH_MINDS_BACKEND_URL}/bots/{user_id}"
    return result
