// src/api.ts

import axios from "axios";
import { ChatInput } from "./index";
import { readApiKey } from "../../util";

// Create the API instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
// });

const api = axios.create();

// Define the API mutation function
export const createChatMutation = async (
  chatInput: ChatInput,
  getToken: any
) => {
  const supabaseAccessToken = await getToken({
    template: "supabase-tarat-clerk",
  });

  const response = await api.post(
    "https://used-tin-production.up.railway.app/api/chats",
    chatInput,
    {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    }
  );
  return response.data;
};
