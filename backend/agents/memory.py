from llama_index.indices.vector_store import VectorStoreIndex
from llama_index.vector_stores import SupabaseVectorStore
from langchain.memory import PostgresChatMessageHistory
from langchain.memory import ConversationBufferMemory


def get_bot_second_brain(user_id):
    vector_store = SupabaseVectorStore(
        postgres_connection_string="postgresql://postgres:KindleDiffusion29@db.wqttbosbkuefkspmaqfa.supabase.co:5432/postgres",
        collection_name=user_id + "_secondary_brain"
    )
    index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
    return index

def get_bot_second_brain_vecstore(user_id):
    vector_store = SupabaseVectorStore(
        postgres_connection_string="postgresql://postgres:KindleDiffusion29@db.wqttbosbkuefkspmaqfa.supabase.co:5432/postgres",
        collection_name=user_id + "_secondary_brain"
    )
    return vector_store


def get_bot_primary_brain(user_id):
    message_history = PostgresChatMessageHistory(
        connection_string="postgresql://postgres:KindleDiffusion29@db.wqttbosbkuefkspmaqfa.supabase.co:5432/postgres",
        session_id=user_id + "_primary_brain",
    )
    memory = ConversationBufferMemory(
        chat_memory=message_history,
        memory_key="chat_history"
    )
    return memory
