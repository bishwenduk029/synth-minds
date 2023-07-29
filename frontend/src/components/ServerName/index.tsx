import { Flex, Heading, Box } from '@chakra-ui/react';
import type React from 'react';
import { ChevronDown } from 'react-feather';

const ServerName: React.FC = () => {
  return (
    <Flex
      bg="brand.200"
      align="center"
      justify="space-between"
      padding="0 11px 0 16px"
      boxShadow="rgb(0, 0, 0, 0.2) 0px 1px 0px 0px"
      zIndex={2}
    >
      <Heading as="h1" size="sm">
        Ava
      </Heading>
      <Box as={ChevronDown} size="28px" cursor="pointer" />
    </Flex>
  );
};

export default ServerName;
