// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { Suspense } from "react";
import Header from "../components/Header.tsx";

// Import ChannelData lazily
const LazyChannelData = React.lazy(
    () => import('../components/ChannelData/index')
  );
  
  const LazyChannelDataWrapper = () => {
    return (
      <>
        <Header />
        {/* Using React's Suspense to handle lazy loading */}
        <Suspense fallback={<div>Loading...</div>}>
          {/* Render the lazy-loaded ChannelData component */}
          <LazyChannelData />
        </Suspense>
      </>
    );
  };

export default LazyChannelDataWrapper;
