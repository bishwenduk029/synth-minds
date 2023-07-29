from typing import Any, List, Optional
from langchain.agents import tool
from pydantic import BaseModel, Field
from agents.memory import get_ava_second_brain_vecstore
from llama_index import StorageContext
from llama_index.indices.vector_store import VectorStoreIndex
from llama_hub.remote.base import RemoteReader

loader = RemoteReader()


def ingest(input: str) -> str:
    """Useful for when you need to learn or digest or ingest or memorize new information from remote locations or on request of the user."""
    remote_url, user_id = input.rsplit(",", 1)
    documents = loader.load_data(url=remote_url)
    vec_store = get_ava_second_brain_vecstore(user_id)
    storage_context = StorageContext.from_defaults(vector_store=vec_store)
    VectorStoreIndex.from_documents(documents, storage_context=storage_context)
    return "Ingested the document successfully"