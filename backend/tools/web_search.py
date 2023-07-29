from typing import Any, List, Optional
from langchain.agents import tool
from llama_index.indices.base import BaseGPTIndex
from llama_index import ServiceContext
from llama_hub.web.beautiful_soup_web.base import BeautifulSoupWebReader
from llama_index import GPTVectorStoreIndex, Document

def initialize_search_index(
    documents: List[Document], service_context: Optional[ServiceContext] = None
) -> BaseGPTIndex[Any]:
    return GPTVectorStoreIndex.from_documents(
        documents, service_context=service_context
    )


@tool("Search Webpage")
def search_webpage(prompt: str) -> str:
    """Useful for searching a specific webpage. The input to the tool should be URL and query, separated by a newline."""
    loader = BeautifulSoupWebReader()
    if len(prompt.split("\n")) < 2:
        return "The input to search_webpage should be a URL and a query, separated by a newline."

    url = prompt.split("\n")[0]
    query_str = " ".join(prompt.split("\n")[1:])

    try:
        documents = loader.load_data(urls=[url])
        service_context = ServiceContext.from_defaults(chunk_size_limit=512)
        index = initialize_search_index(documents, service_context=service_context)
        query_result = index.query(
            query_str, similarity_top_k=3, response_mode="compact"
        )
        return str(query_result)
    except ValueError as e:
        return str(e)
    except Exception:
        return "Encountered an error while searching the webpage."