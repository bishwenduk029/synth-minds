from langchain.llms import OpenAI, GPT4All, OpenAIChat
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler


import os
from typing import Union

# Create a global instance of LanguageModelManager
llm_manager = None


class ModelFactory:
    """Factory for creating language models"""

    def __init__(self):
        # Add new models to this dictionary
        self.model_dict = {
            "gpt-4-all": self.create_gpt4all_model,
            "gpt-4": self.create_openai_gpt4_model,
            "gpt-3.5": self.create_openai_gpt3_model,
        }

    def create_model(self, model_name: str, api_key: str, verbose: bool = False) -> Union[GPT4All, OpenAI]:
        """Create a model object based on the model name"""
        if model_name in self.model_dict:
            return self.model_dict[model_name](api_key, verbose)
        else:
            raise ValueError(f"Unknown model type: {model_name}")

    def create_gpt4all_model(self, verbose: bool) -> GPT4All:
        model_file_path = os.getenv('GPT4ALL_MODEL_PATH')
        if not model_file_path:
            raise ValueError(
                "Environment variable GPT4ALL_MODEL_PATH cannot be empty for 'gpt-4-all'")
        callbacks = [StreamingStdOutCallbackHandler()]
        llm = GPT4All(model=model_file_path,
                      callbacks=callbacks, verbose=verbose)
        return llm

    def create_openai_gpt4_model(self, api_key: str, verbose: bool = False) -> OpenAI:
        llm = OpenAI(temperature=0, model_name="gpt-4",
                     openai_api_key=api_key, verbose=verbose)
        return llm

    def create_openai_gpt3_model(self, api_key: str = None, verbose: bool = False) -> OpenAI:
        llm = OpenAIChat(
            temperature=0, model_name="gpt-3.5-turbo", verbose=verbose)
        return llm


# Reading the model name from the environment variables
model_name = os.getenv('MODEL_NAME')

# Using the model name to create a language model
factory = ModelFactory()


class LanguageModelManager:
    def __init__(self, api_key):
        self.api_key = api_key
        self.llm_gpt4 = factory.create_model(
            "gpt-4", api_key=self.api_key, verbose=False)
        self.llm_gpt35 = factory.create_model(
            "gpt-3.5", api_key=self.api_key, verbose=False)

    def get_llm_gpt4(self):
        return self.llm_gpt4

    def get_llm_gpt35(self):
        return self.llm_gpt35
