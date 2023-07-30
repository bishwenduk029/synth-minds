// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Header from "../components/Header.tsx";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import BotPage from "./BotPage.tsx";

const BotPageWrapper = () => {
  return (
    <>
      <Header />
      <SignedIn>
        <BotPage />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default BotPageWrapper;
