"use client";
import {
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import type React from "react";
import { useRef, useEffect, useState, useCallback } from "react";
import { Plus, PlusCircle } from "react-feather";
import { FaArrowAltCircleRight } from "react-icons/fa";

import ChannelMessage from "../ChannelMessage";
import type { Message } from "../stores/index";
import { useStore } from "../stores/index";
import { useDropzone } from "react-dropzone";
import { supabase } from "../core/supabase-client.js";
import { useAuth } from "@clerk/clerk-react";
import { useMicVADWrapper } from "../hooks/useMicVADWrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChatMutation } from "./api";
import { MoonLoader } from "react-spinners";

export type FilePreview = File & { preview: string };

export interface ChatInput {
  // Define the properties of your ChatInput interface based on your requirements
  user_message: string;
}

const uploadToSupabase = async (file: File) => {
  try {
    // TODO: replace the timestamp with the user_id to allow different users to upload files with same name
    const fileName = `${file.name}`;
    const { data, error } = await supabase.storage
      .from("ava")
      .upload(fileName, file);

    if (data) {
      const publicPathObj = await supabase.storage
        .from("ava")
        .getPublicUrl(fileName);
      return publicPathObj.data.publicUrl;
    }
    console.log(error);
  } catch (error) {
    console.log(error);
    return "";
  }
};

const handleUpload = async (files: any) => {
  // const filesToUpload = Array.from(files);

  const url = await uploadToSupabase(files[0]);
  return url;
};

const ChannelData: React.FC = () => {
  const [messages, setMessages] = useStore.messages();
  const [newMessage, setNewMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const micVad = useMicVADWrapper(setLoading, getToken);

  // console.log(messages, isUploading, files, errorMessages);

  // Define the mutation function using useMutation and pass getToken as the second parameter
  const createChat = useMutation(
    (chatInput: ChatInput) => createChatMutation(chatInput, getToken),
    {
      onSuccess: (data) => {
        // Handle the onSuccess callback with the response data
        console.log(data);
        setMessages((old: any) => [
          ...old,
          {
            id: Date.now().toString(),
            author: "Bot",
            content: data,
            hasMentioned: false,
            isBot: true,
            src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
          },
        ]);
        setIsThinking(false);
      },
      onError: (error) => {
        // Handle any errors that occur during the mutation
        setIsThinking(false);
        console.error("Error creating chat:", error);
      },
    }
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    maxSize: 10000000, // 10mo
    onDropRejected: (events) => {
      setErrorMessages([]);
      const messages: { [key: string]: string } = {};

      events.forEach((event) => {
        event.errors.forEach((error) => {
          messages[error.code] = error.message;
        });
      });

      setErrorMessages(Object.keys(messages).map((id) => messages[id]));
    },
    onDrop: async (acceptedFiles) => {
      setErrorMessages([]);
      setFiles([...files]);
      setIsUploading(true);
      const url = await handleUpload(acceptedFiles);
      setMessages((old: any) => [
        ...old,
        {
          id: Date.now().toString(),
          author: "Bot",
          content: `Your file has been uploaded at ${url}. Please let me know if I need to memorize the content of the file`,
          hasMentioned: true,
          isBot: true,
          src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
        },
      ]);
      setIsUploading(false);
    },
  });

  if (loading) {
    return <MoonLoader color="#fff" />;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsThinking(true);
    setMessages((old: any) => [
      ...old,
      {
        id: Date.now().toString(),
        author: "Bot",
        content: newMessage,
        hasMentioned: false,
        isBot: true,
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
      },
    ]);
    const formData: ChatInput = {
      // Extract the form data here (e.g., message: e.target.message.value)
      user_message: newMessage,
    };
    // Call the mutation function with the form data
    try {
      // @ts-ignore
      createChat.mutate(formData, getToken);
    } catch (error) {
      console.log(error);
    }
    setNewMessage("");
  };

  const handleInputKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      // Manually call the form submission when Enter key is pressed
      await handleSubmit(e as React.FormEvent);
    }
  };

  return (
    <Flex
      gridArea="CD"
      direction="column"
      justify="space-between"
      bg="gray.700"
      p={2}
      height="100%"
    >
      <div className="messages">
        {messages?.map((message: Message, index: number) => (
          <ChannelMessage
            key={index}
            author={message.author}
            date={message.date}
            src={message.src}
            content={message.content}
            isBot={message.isBot}
            hasMention={message.hasMentioned}
          />
        ))}
      </div>

      <InputGroup as="div" w="100%" padding="16px 16px">
        <form
          style={{ width: "100%", outline: "none" }}
          onSubmit={handleSubmit}
        >
          <InputLeftElement left="24px" top="18px" {...getRootProps()}>
            <input {...getInputProps()} />
            <IconButton
              aria-label="Upload a document"
              size="sm"
              bgColor="green.400"
              color="white"
              onClick={open}
              icon={<Plus />}
            />
          </InputLeftElement>
          <Input
            w="100%"
            h="44px"
            type="text"
            padding="0 10px 0 57px"
            rounded="7px"
            color="white"
            bg="gray.600"
            position="relative"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Start working with Ava"
            _placeholder={{ color: "white.200" }}
            focusBorderColor="none"
            onKeyDown={handleInputKeyDown}
          />
          <InputRightElement right="24px" top="18px">
            <IconButton
              aria-label="Summarize the URL"
              isLoading={isThinking}
              size="sm"
              bgColor="green.400"
              color="white"
              type="submit"
              icon={<FaArrowAltCircleRight />}
            />
          </InputRightElement>
        </form>
      </InputGroup>
    </Flex>
  );
};

export default ChannelData;
