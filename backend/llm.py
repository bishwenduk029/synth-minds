from langchain.llms import OpenAI, GPT4All
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler


import os
from typing import Union

class ModelFactory:
    """Factory for creating language models"""

    def __init__(self):
        # Add new models to this dictionary
        self.model_dict = {
            "gpt-4-all": self.create_gpt4all_model,
            "openai": self.create_openai_model,
        }

    def create_model(self, model_name: str, verbose: bool = False) -> Union[GPT4All, OpenAI]:
        """Create a model object based on the model name"""
        if model_name in self.model_dict:
            return self.model_dict[model_name](verbose)
        else:
            raise ValueError(f"Unknown model type: {model_name}")

    def create_gpt4all_model(self, verbose: bool) -> GPT4All:
        model_file_path = os.getenv('GPT4ALL_MODEL_PATH')
        if not model_file_path:
            raise ValueError("Environment variable GPT4ALL_MODEL_PATH cannot be empty for 'gpt-4-all'")
        callbacks = [StreamingStdOutCallbackHandler()]
        llm = GPT4All(model=model_file_path, callbacks=callbacks, verbose=verbose)
        return llm

    def create_openai_model(self, verbose: bool) -> OpenAI:
        llm = OpenAI(temperature=0, model_name="gpt-4")
        return llm

# Reading the model name from the environment variables
model_name = os.getenv('MODEL_NAME')

# Using the model name to create a language model
factory = ModelFactory()
llm = factory.create_model(model_name, verbose=True)
