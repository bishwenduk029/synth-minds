from agents.memory import get_bot_second_brain


def query(input: str) -> str:
    """Useful for when you need to query from information you have already learned, memorized or ingested. This second brain contains many documents, information or data ingested from remote location or over a course of time."""
    query, user_id = input.rsplit(",", 1)
    secondary_index = get_bot_second_brain(user_id)
    query_engine = secondary_index.as_query_engine()
    return query_engine.query(query)