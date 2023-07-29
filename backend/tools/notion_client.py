from typing import List, Union
import os
from notion_client import Client
from pydantic import BaseModel, Field
from langchain.tools import tool
import uuid

import openai

def ai_function(function, args, description, model = "gpt-4"):
    # parse args to comma separated string
    args = ", ".join(args)
    messages = [{"role": "system", "content": f"You are now the following python function: ```# {description}\n{function}```\n\nOnly respond with your `return` value. Do not include any other explanatory text in your response and also do not update the function."},{"role": "user", "content": args}]

    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0
    )

    return response.choices[0].message["content"]

notion = Client(auth=os.environ["NOTION_API_KEY"])



class NotionInput(BaseModel):
    content: Union[str, List[str]]
    dbname: str
    title: str


class NotionBlockInput(BaseModel):
    title: str
    content_block: list[dict]


def create_database(notion: Client, database_name: str) -> str:
    # Generate a new unique ID for the parent page
    parent_page_id = str(uuid.uuid4())
    
    # Create the new page as the parent
    new_page = notion.pages.create(parent={"page_id": parent_page_id}, properties={"title": {"title": [{"text": {"content": database_name}}]}})
    
    # Create the new database within the new page
    new_database = notion.databases.create(parent={"page_id": new_page.id}, title=[{"text": {"content": database_name}}])
    
    return new_database.id


def get_database_id(notion: Client, dbname: str) -> str:
    list_databases = notion.search(filter={"property": "object", "value": "database"}).get("results")
    for database in list_databases:
        if database["title"][0]["text"]["content"] == dbname:
            return database["id"]

    # Create a new database if it does not exist
    database_id = create_database(notion, dbname)
    return database_id

def create_page(notion: Client, database_id: str, title: str, content_blocks: List[dict]) -> dict:
    new_page = {
        "object": "page",
        "properties": {
            "title": {
                "title": [
                    {
                        "text": {
                            "content": title
                        }
                    }]
            },
        },
        "children": content_blocks
    }
    created_page = notion.pages.create(parent={"type": "database_id", "database_id": database_id}, properties=new_page["properties"], children=new_page["children"])
    return created_page


def create_content_block(content: str) -> dict:
    response_text = ai_function("def generate_notion_content_block(content: str) -> dict : ", content, "Given the content as input, create an organized content object in Notion format as a Python dictionary. Use an appropriate block type based on the content provided. If the content looks like a task or TODO, add a checkbox to the content block. If a deadline is provided in the content, represent it in the block as well. Always use the 'rich_text' property in the content block, and generate a content block that is appropriate for the provided content. DO NOT FORGET rich_text in the content block.")
    notion_content_block = eval(response_text)
    return notion_content_block
    # return {
    #     "object": "block",
    #     "type": "paragraph",
    #     "paragraph": {
    #         "rich_text": [{"type": "text", "text": {"content": content}}]
    #     }
    # }





# @tool("Update Notion",args_schema=NotionInput)
def update_notion_content(content: Union[str, List[str]], dbname: str, title: str) -> str:
    """Updates content in a Notion database with the given title and content."""

    database_id = "b0dffff60775482680805231e0cbc814"
    if not database_id:
        return f"Database '{dbname}' not found."

    if isinstance(content, str):
        content = [content]

    content_blocks = [create_content_block(c) for c in content]

    created_page = create_page(notion, database_id, title, content_blocks)

    if created_page:
        return f"Successfully updated {dbname} with title: {title} and content: {content}"
    else:
        return f"Failed to update {dbname} with title: {title} and content: {content}"


@tool("Update in Notion",args_schema=NotionBlockInput)
def update_or_create_page(title: str, content_block: list[dict]) -> dict:
    """Updates content block in a relevant page in Notion database with the given title."""
    
    # Step 1: Search for an existing page with the given title
    existing_pages = notion.databases.query(
        **{
            "database_id": "b0dffff60775482680805231e0cbc814",
            "filter": {
                "property": "title",
                "title": {
                    "equals": title
                }
            }
        }
    )

    # Step 2: If the page exists, update the content block
    if existing_pages["results"]:
        existing_page = existing_pages["results"][0]
        page_id = existing_page["id"]
        notion.blocks.children.append(
            block_id=page_id,
            children=content_block
        )
        return existing_page
    # Step 3: If the page doesn't exist, create a new page with the given content block
    else:
        new_page = {
            "object": "page",
            "properties": {
                "title": {
                    "title": [
                        {
                            "text": {
                                "content": title
                            }
                        }]
                },
            },
            "children": content_block
        }
        try:
            created_page = notion.pages.create(parent={"type": "database_id", "database_id": "b0dffff60775482680805231e0cbc814"}, properties=new_page["properties"], children=new_page["children"])
        except Exception as e:
            return str(e)
        return created_page

