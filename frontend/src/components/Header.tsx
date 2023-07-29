"use client";
import {
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { TbRobot } from "react-icons/tb";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Header = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  return (
    <Flex width="100%" flexDirection="column" marginX="auto" px="2">
      <Flex justifyContent="space-between" py={4} as="header">
        <Flex role="group" alignItems="center" fontWeight="bold" fontSize="2xl">
          <Link to="/">
            <Icon
              transition="200ms all"
              _groupHover={{ color: "brand.500" }}
              color="brand.300"
              as={TbRobot}
              mr="1"
            />
            <Text color="brand.400" display={{ base: "none", sm: "inherit" }}>
              Kibb
            </Text>
          </Link>
        </Flex>
        <HStack spacing={1}>
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Link to="/sign-in">
              <Button size="sm">
                Login
              </Button>
            </Link>
          )}
        </HStack>
      </Flex>
    </Flex>
  );
};

export default Header;
