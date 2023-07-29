from typing import Any, List, Optional
from langchain.agents import tool
from llama_index import Document
from llama_index import GPTVectorStoreIndex, Document
from llama_index.indices.base import BaseGPTIndex
from llama_index import ServiceContext
from pydantic import BaseModel, Field
from agents.memory import get_ava_second_brain

def record_note(note: str, user_id: str) -> str:
    """Useful for when you need to record a note or reminder for yourself to reference in the future."""
    # actual_note, user_id = note.split(",")
    try:
        secondary_index = get_ava_second_brain(user_id)
        secondary_index.insert(Document(note))
        return "Note successfully recorded."
    except Exception as e:
        return str(e)
    
def parsing_record_note(input: str):
    note, user_id = input.rsplit(",", 1)  # Split on the last comma
    return record_note(note, user_id)


def search_notes(query_str: str, user_id: str) -> str:
    """Useful for searching through notes that you previously recorded."""
    # query, user_id = query_str.split(",")
    try:
        secondary_index = get_ava_second_brain(user_id)
        query_engine = secondary_index.as_query_engine()
        response = query_engine.query(query_str)
        return str(response)
    except Exception as e:
        return str(e)
    

def parsing_search_note(input: str):
    note, user_id = input.split(",")
    return search_notes(note, user_id)