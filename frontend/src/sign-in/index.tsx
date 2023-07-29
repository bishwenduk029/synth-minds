"use client";
import { Box, Container } from "@chakra-ui/react";
import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <Container>
      <Box m={100} height={"100%"}>
        <SignIn afterSignInUrl="/chats" />
      </Box>
    </Container>
  );
}
