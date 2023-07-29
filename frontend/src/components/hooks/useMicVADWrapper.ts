import { useEffect, useRef, useState } from "react";
import { useMicVAD } from "@ricky0123/vad-react";
import { onMisfire, createOnSpeechEnd, onSpeechStart } from "../speech-manager";

export const useMicVADWrapper = (onLoadingChange, getToken) => {
  const onSpeechEnd = createOnSpeechEnd(getToken);
  const micVAD = useMicVAD({
    preSpeechPadFrames: 5,
    positiveSpeechThreshold: 0.9,
    negativeSpeechThreshold: 0.75,
    minSpeechFrames: 4,
    startOnLoad: true,
    onSpeechStart: onSpeechStart,
    onSpeechEnd: onSpeechEnd,
    onVADMisfire: onMisfire,
  });

  const loadingRef = useRef(micVAD.loading);
  useEffect(() => {
    if (loadingRef.current !== micVAD.loading) {
      onLoadingChange(micVAD.loading);
      loadingRef.current = micVAD.loading;
    }
  });

  return micVAD;
};
