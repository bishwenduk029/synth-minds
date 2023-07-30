"use client";
import {
  Box,
  Button,
  Center,
  Container,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChatMutation } from "./api";
import { MoonLoader } from "react-spinners";
import { useUser } from "@clerk/clerk-react";
import MyVisualizer from "../AudioVisualizaer/index.js";
import { readApiKey } from "../../util/index.js";

export type FilePreview = File & { preview: string };

export interface ChatInput {
  // Define the properties of your ChatInput interface based on your requirements
  user_message: string;
  api_key: string;
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

const ChannelData: React.FC = ({ hasVoice }: { hasVoice: boolean }) => {
  const { user } = useUser();
  const [messages, setMessages] = useStore.messages();
  const [newMessage, setNewMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

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
          src: "https://wqttbosbkuefkspmaqfa.supabase.co/storage/v1/object/public/ava/synth.png?t=2023-07-29T19%3A48%3A17.368Z",
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
        author: user.firstName,
        content: newMessage,
        hasMentioned: false,
        isBot: false,
        src: user.imageUrl,
      },
    ]);
    const apiKey = readApiKey();
    const formData: ChatInput = {
      // Extract the form data here (e.g., message: e.target.message.value)
      user_message: newMessage,
      api_key: apiKey,
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
      mt={"auto"}
      bg="gray.700"
      w={"100%"}
      p={8}
      height="75%"
      width={"100%"}
    >
      <div className="messages" style={{ overflowY: "scroll", width: "100%" }}>
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

      <form
        style={{
          outline: "none",
          width: "100%",
          backgroundColor: "gray.700",
        }}
        onSubmit={handleSubmit}
      >
        <InputGroup
          ml="4%"
          as="div"
          w="95%"
          padding="16px 16px"
          position={"absolute"}
          top={"90%"}
          left={"-1%"}
          height="10%"
        >
          <InputLeftElement left="24px" top="24px" {...getRootProps()}>
            <input {...getInputProps()} />
            <IconButton
              aria-label="Upload a document"
              size="md"
              bgColor="green.400"
              color="white"
              onClick={open}
              icon={<Plus />}
            />
          </InputLeftElement>
          <Input
            w="100%"
            h="100%"
            type="text"
            padding="0 12px 0 65px"
            rounded="7px"
            color="white"
            bg="gray.600"
            position="relative"
            fontSize={"2xl"}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Start chatting with Synthia to build a new bot"
            _placeholder={{ color: "white.200" }}
            focusBorderColor="none"
            onKeyDown={handleInputKeyDown}
          />
          <InputRightElement right="24px" top="24px">
            <IconButton
              aria-label="Chat with Synthia"
              isLoading={isThinking || isUploading}
              size="md"
              bgColor="green.400"
              color="white"
              type="submit"
              icon={<FaArrowAltCircleRight />}
            />
          </InputRightElement>
        </InputGroup>
      </form>
    </Flex>
  );
};

export default ChannelData;
