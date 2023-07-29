import { Box, Flex, useBreakpointValue } from '@chakra-ui/react';
import type React from 'react';

// @ts-ignore
const Layout: React.FC = ({ children }) => {
  const template = useBreakpointValue({
    base: `
      'SN'
      'CD'
    `,
    sm: `
      'SL CI'
      'SL CL'
      'SL CD'
      'SL'
    `,
    md: `
      'SN SL'
      'SN CD'
    `,
  });

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: '1fr',
        sm: 'auto auto',
        md: 'auto auto',
      }}
      gridTemplateRows={{ base: 'auto', sm: '46px auto 52px' }}
      gridTemplateAreas={template}
      height="100vh"
    >
      {children}
    </Box>
  );
};

export default Layout;

/**
 * SL - Server list
 * SN - Server Name
 * CI - Channel Info
 * CL - Channel List
 * CD - Channel Data
 * UL - User List
 * UI - User Info
 */
