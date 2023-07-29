// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { Suspense } from "react";
import Header from "../components/Header.tsx";
import {
  RedirectToSignIn,
  SignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

// Import ChannelData lazily
const LazyChannelData = React.lazy(
  () => import("../components/ChannelData/index")
);

const LazyChannelDataWrapper = () => {
  return (
    <>
      <Header />
      <SignedIn>
        {/* Using React's Suspense to handle lazy loading */}
        <Suspense fallback={<div>Loading...</div>}>
          {/* Render the lazy-loaded ChannelData component */}
          <LazyChannelData />
        </Suspense>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default LazyChannelDataWrapper;
