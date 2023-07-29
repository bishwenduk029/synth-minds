"use client";
import { Container } from "@chakra-ui/react";
import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <Container>
      <SignIn afterSignInUrl="/chats" />
    </Container>
  );
}
