import { Flex, Text, Box, Button } from '@chakra-ui/react';
import type React from 'react';
import { Hash, Settings, UserPlus } from 'react-feather';

interface Props {
  channelName: string;
  selected?: boolean;
}

const ChannelButton: React.FC<Props> = ({ channelName, selected }) => {
  return (
    <Button
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="5px 3px"
      cursor="pointer"
      border-radius="sm"
      bg={selected ? 'gray.100' : 'transparent'}
      transition="background-color .2s"
      _hover={{ backgroundColor: 'gray.100' }}
    >
      <Flex align="center">
        <Box as={Hash} size="20px" cursor="pointer" color="gray.700" />
        <Text
          fontSize="15px"
          color={selected ? 'white' : 'gray.800'}
          marginLeft="5px"
        >
          {channelName}
        </Text>
      </Flex>

      <Flex>
        <Box
          as={UserPlus}
          size="16px"
          cursor="pointer"
          color={selected ? 'gray.700' : 'transparent'}
          transition="color .2s"
          _hover={{ color: 'white' }}
        />
        <Box
          as={Settings}
          size="16px"
          cursor="pointer"
          color={selected ? 'gray.700' : 'transparent'}
          transition="color .2s"
          _hover={{ color: 'white' }}
          marginLeft="4px"
        />
      </Flex>
    </Button>
  );
};

export default ChannelButton;
