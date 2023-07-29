'use client'
import { SignUp } from "@clerk/clerk-react";

export default function SignOutPage() {
  return <SignUp afterSignUpUrl="/chats" />;
}