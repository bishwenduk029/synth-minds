import requests
from langchain.agents import tool

@tool("Get Google Access Token")
def get_access_token(url="http://localhost:3000/api/token"):
    """Use this when you want to retrieve the google access token to communicate with the any of the google APIs for the user."""
    try:
        # Send a GET request to the API endpoint
        response = requests.get(url)

        # If the response was successful, no Exception will be raised
        response.raise_for_status()

    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
        return None
    except Exception as err:
        print(f'Other error occurred: {err}')
        return None
    else:
        # parse the response as JSON and return the access token
        data = response.json()
        return data.get('accessToken')
