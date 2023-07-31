from langchain.agents import ConversationalAgent, Tool, AgentExecutor
from langchain import LLMChain
from .prompt import PREFIX, SUFFIX, FORMAT_INSTRUCTIONS
from agents.memory import get_bot_primary_brain
from tools.query import query
from llm import factory
from functools import lru_cache

tools = [
    Tool(
        name="Query or Search content from your Second Brain",
        func=query,
        description="Useful for searching through information you have already learned, memorized or ingested in your second brain. This second brain contains many documents, information or data ingested from remote location or over a course of time. The input to this tool should be comma separated list of strings of length 2. For example `Some Query, cc9fkjdkfd`"
    ),
]


prompt = ConversationalAgent.create_prompt(
    tools,
    prefix=PREFIX,
    suffix=SUFFIX,
    format_instructions=FORMAT_INSTRUCTIONS,
    human_prefix="HUMAN",
    input_variables=["input", "agent_scratchpad", "chat_history"]
)

# llm_chain = LLMChain(llm=OpenAI(
#     temperature=0, model_name="gpt-4"), prompt=prompt)

tool_names = [tool.name for tool in tools]


@lru_cache(100)
def get_elf_for_user(user_id, api_key):
    llm = factory.create_openai_gpt3_model(api_key=api_key)
    llm_chain = LLMChain(llm=llm, prompt=prompt)
    agent = ConversationalAgent(llm_chain=llm_chain, allowed_tools=tool_names)
    memory = get_bot_primary_brain(user_id)
    agent_executor = AgentExecutor.from_agent_and_tools(
        agent=agent, tools=tools, verbose=False, memory=memory)
    return agent_executor
