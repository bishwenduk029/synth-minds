import time

from agents.elf.index import get_elf_for_user
from agents.ava import get_ava_for_user


async def get_completion(user_prompt, user_id, api_key, hasVoice):
    if _is_empty(user_prompt):
        raise ValueError("empty user prompt received")

    start_time = time.time()
    bot = None
    # messages = [
    #     {
    #         "role": "system",
    #         "content": INITIAL_PROMPT
    #     }
    # ]
    # messages.extend(_get_additional_initial_messages())
    # messages.extend(json.loads(base64.b64decode(conversation_thus_far)))
    # messages.append({"role": "user", "content": user_prompt})

    # logging.debug("calling %s", AI_COMPLETION_MODEL)
    # res = await openai.ChatCompletion.acreate(model=AI_COMPLETION_MODEL, messages=messages, timeout=15)
    if(hasVoice):
        bot = get_elf_for_user(user_id, api_key)
    else:
        bot = get_ava_for_user(user_id, api_key)
    
    completion = bot.run(user_prompt + "\nuser_id is " + user_id)

    return completion


def _is_empty(user_prompt: str):
    return not user_prompt or user_prompt.isspace()


def _get_additional_initial_messages():
    return []
