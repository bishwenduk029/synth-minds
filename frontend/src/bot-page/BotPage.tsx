import { useMicVADWrapper } from "../components/hooks/useMicVADWrapper.ts";
import { particleActions } from "../components/particle-manager.ts";
import { useState } from "react";
import Canvas from "../components/AudioVisualizaer/index.tsx";
import { RingLoader } from "react-spinners";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";

const BotPage = () => {
  const [loading, setLoading] = useState(false);
  const { userId } = useParams();
  const { getToken } = useAuth();

  useMicVADWrapper(setLoading, getToken, userId);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <RingLoader
          loading={loading}
          size={150}
          color={"#27eab6"}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return <Canvas draw={particleActions.draw} />;
};

export default BotPage;
