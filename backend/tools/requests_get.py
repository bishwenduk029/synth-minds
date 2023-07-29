"""Tools for making requests to an API endpoint."""
import requests
import json
from typing import Any, Dict, Optional

from pydantic import BaseModel
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)

from langchain.requests import TextRequestsWrapper
from langchain.tools.base import BaseTool

def _parse_input(text: str) -> Dict[str, Any]:
    """Parse the json string into a dict."""
    return json.loads(text)


def _clean_url(url: str) -> str:
    """Strips quotes from the url."""
    return url.strip("\"'")

class RequestsGetTool(BaseTool):
    """Tool for making a GET request to an API endpoint."""

    name = "requests_get"
    description = """A portal to the internet. Use this when you need to get specific content from a website. Input should be a json string with two keys: "url" and "headers". The output will be the text response of the GET request."""

    def _run(
        self, text: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> str:
        """Run the tool."""
        try:
            data = json.loads(text)
            response = requests.get(_clean_url(data["url"]), headers=data.get("headers", {}))
            return response.text
        except Exception as e:
            return repr(e)
        
    async def _arun(
        self,
        url: str,
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ) -> str:
        """Run the tool asynchronously."""
        # You need an async library to make asynchronous HTTP requests.
        # 'requests' library doesn't support async. You may need to use 'aiohttp' or similar library.
        pass