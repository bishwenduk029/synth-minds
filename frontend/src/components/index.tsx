import type { FlexProps } from '@chakra-ui/react';
import { Flex, Box, useBreakpointValue } from '@chakra-ui/react';
import type React from 'react';

// @ts-ignore
const Layout: React.FC = ({ children }) => {
  return (
    <Flex flexDirection={'column'} height="100vh" width="100%" px={{ md: 5 }}>
      {children}
    </Flex>
  );
};

export default Layout;
