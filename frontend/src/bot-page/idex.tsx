// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { Suspense } from "react";
import Header from "../components/Header.tsx";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { RingLoader } from "react-spinners";

// Import ChannelData lazily
const LazyBotPage = React.lazy(() => import("./BotPage.tsx"));

const LazyBotPageWrapper = () => {
  return (
    <>
      <Header />
      <SignedIn>
        {/* Using React's Suspense to handle lazy loading */}
        <Suspense
          fallback={
            <RingLoader
              loading={true}
              size={150}
              color={"#27eab6"}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          }
        >
          {/* Render the lazy-loaded ChannelData component */}
          <LazyBotPage />
        </Suspense>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default LazyBotPageWrapper;
