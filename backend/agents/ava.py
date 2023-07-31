from langchain.agents import ConversationalAgent, Tool, AgentExecutor
from langchain import LLMChain
from .prompt import PREFIX, SUFFIX, FORMAT_INSTRUCTIONS
from .memory import get_bot_primary_brain
from tools.query import query
from tools.ingest import ingest
from tools.upload_file import upload_file
from tools.web_search import search_webpage
from tools.google_search import search
from tools.note_taking import parsing_record_note
from langchain.agents import load_tools
from llm import factory
from functools import lru_cache

basic_tools = load_tools(["requests_all"])

google_search_tool = Tool(
    name="Google Search",
    description="Search Google for recent results or better understanding something.",
    func=search.run
)

tools = [search_webpage, google_search_tool,
         Tool(
             name="Remember or Memorize information or content",
             func=parsing_record_note,
             description="Useful for when you need to record or memorize some information, data or note into your second brain for reference in the future. The input to this tool should be comma separated list of strings of length 2. For example `Some Note, cc9fkjdkfd`"
         ),
         Tool(
             name="Remember or Memorize content from remote location",
             func=ingest,
             description="Useful for when you need to learn or digest or ingest or memorize new information from remote locations. The input to this tool should be comma separated list of strings of length 2. For example `remote url or website url, cc9fkjdkfd`"
         ),
         Tool(
             name="Query or Search content from your Second Brain",
             func=query,
             description="Useful for searching through information you have already learned, memorized or ingested in your second brain. This second brain contains many documents, information or data ingested from remote location or over a course of time. The input to this tool should be comma separated list of strings of length 2. For example `Some Query, cc9fkjdkfd`"
         ),
         Tool(
             name="Instructions on Uploading files",
             func=upload_file,
             description="Useful when user is interested in uploading some file or ingesting some file"
         )
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
def get_ava_for_user(user_id, api_key):
    llm = factory.create_openai_gpt3_model(api_key=api_key)
    memory = get_bot_primary_brain(user_id)
    llm_chain = LLMChain(llm=llm, prompt=prompt)
    agent = ConversationalAgent(llm_chain=llm_chain, allowed_tools=tool_names)
    agent_executor = AgentExecutor.from_agent_and_tools(
        agent=agent, tools=tools, verbose=False, memory=memory, handle_parsing_errors="Check your output and make sure it conforms!")
    return agent_executor
