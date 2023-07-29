import React from 'react';
import { Flex, Heading, Box, Text } from '@chakra-ui/react';
import { Plus } from 'react-feather';

import ChannelButton from '../ChannelButton';

const ChannelList: React.FC = () => {
  return (
    <Flex
      gridArea="CL"
      direction="column"
      padding="24px 9.5px 0 16px "
      bg="gray.200"
    >
      <Flex
        align="center"
        justify="space-between"
        marginBottom="6px"
      >
        <Text
          textTransform="uppercase"
          font-size="12px"
          fontWeight="medium"
          color="gray.900"
        >Canais de texto</Text>
        <Box as={Plus} size="21px" cursor="pointer" color="gray.700" />
      </Flex>
    </Flex>
  );
}

export default ChannelList;
