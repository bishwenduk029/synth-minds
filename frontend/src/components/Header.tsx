"use client";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { FaBrain } from "react-icons/fa";

const Header = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  return (
    <Flex width="100%" flexDirection="column" marginX="auto" px="20">
      <Flex justifyContent="space-between" as="header">
        <Link to="/" style={{ width: "100%" }}>
          <Flex
            role="group"
            alignItems="center"
            fontWeight="bold"
            fontSize="2xl"
          >
            <Image src="/brain2.png" mx="5" />

            <Text color="brand.400" display={{ base: "none", sm: "inherit" }}>
              Synth Minds
            </Text>
          </Flex>
        </Link>

        <HStack spacing={1}>
          <Box w="100%">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link to="/sign-in">
                <Button colorScheme="brand" size="lg">
                  Login
                </Button>
              </Link>
            )}
          </Box>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default Header;
