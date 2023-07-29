// @ts-ignore
"use client";
import { Avatar, Flex, Heading, Box, Text } from "@chakra-ui/react";
import type React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export interface Props {
  author: string;
  src: string;
  date: string;
  content: string | React.ReactElement | React.ReactNode;
  hasMention?: boolean;
  isBot?: boolean;
}

export const Mention: React.FC = () => {
  return <Text color="blue.300" cursor="pointer" />;
};

const ChannelMessage: React.FC<Props> = ({
  author,
  src,
  date,
  content,
  hasMention,
  isBot,
}) => {
  return (
    <Box
      display="flex"
      padding="4px 16px"
      marginRight="4px"
      marginTop="13px"
      _first={{ marginTop: "auto" }}
    >
      <Avatar size="md" name={author} src={src} />

      <Flex
        minH="40px"
        direction="column"
        justify="space-between"
        marginLeft="17px"
        bg="transparent"
      >
        <Flex align="center">
          {!isBot && (
            <Heading color={isBot ? "#6e86d6" : "#f84a4b"} fontSize={"xl"}>
              {author.toLocaleUpperCase()}
            </Heading>
          )}
          {isBot && (
            <Text
              marginLeft="6px"
              bg="blue.400"
              color="white"
              rounded="4px"
              padding="4px 5px"
              textTransform="uppercase"
              fontWeight="bold"
            >
              Bot
            </Text>
          )}
          <Text
            as="em"
            marginLeft={"3"}
            color={hasMention ? "#6e86d6" : "alpha.900"}
          >
            {date}
          </Text>
        </Flex>
        <Flex
          textAlign="left"
          color="white"
          bgColor={isBot ? "#000" : "none"}
          p="5"
          rounded={"2xl"}
          mt={isBot ? "5" : "0"}
        >
          <Box color="alpha.300" cursor="pointer" marginRight="8px" fontSize={"2xl"}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
            >{`${content}`}</ReactMarkdown>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ChannelMessage;
