"use client";
import { utils } from "@ricky0123/vad-react";
import { particleActions } from "./particle-manager.ts";
import { readApiKey } from "../util/index.ts";

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

let source: AudioBufferSourceNode;
let sourceIsStarted = false;
const conversationThusFar = [];

export const onSpeechStart = () => {
  console.log("speech started");
  particleActions.onUserSpeaking();
  stopSourceIfNeeded();
};

export const onSpeechStartEmpty = () => {
  console.log("speech started in wrong vad");
};

export const createOnSpeechEnd = (getToken: Function, userID: string) => {
  const onSpeechEnd = async (audio: any) => {
    console.log("speech ended");
    await processAudio(audio, getToken, userID);
  };

  return onSpeechEnd;
};

export const onMisfire = () => {
  particleActions.reset();
  console.log("vad misfire");
};

const stopSourceIfNeeded = () => {
  if (source && sourceIsStarted) {
    source.stop(0);
    sourceIsStarted = false;
  }
};

const processAudio = async (audio: any, getToken: Function, userID: string) => {
  particleActions.onProcessing();
  const blob = createAudioBlob(audio);
  await validate(blob);
  const supabaseAccessToken = await getToken({
    template: "supabase-tarat-clerk",
  });
  sendData(blob, supabaseAccessToken, userID);
};

const createAudioBlob = (audio: any) => {
  const wavBuffer = utils.encodeWAV(audio);
  return new Blob([wavBuffer], { type: "audio/wav" });
};

const debounce = (
  func: (...args: any[]) => void,
  timeout = 300
): ((...args: any[]) => void) => {
  let timer: NodeJS.Timeout | null = null;
  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

const sendData = debounce(function (blob: any, jwtToken: any, userID: string) {
  // if 'sendData' uses 'this', make it a regular function
  console.log("sending data");
  const apiKey = readApiKey();
  console.log(apiKey)
  fetch(`https://used-tin-production.up.railway.app/api/inference/${userID}`, {
    method: "POST",
    body: createBody(blob),
    headers: {
      Authorization: `bearer ${jwtToken}`,
      "api-key": apiKey,
    },
  })
    .then(handleResponse)
    .then((blob) => {
      handleSuccess(blob);
    })
    .catch(handleError);
}, 10);

function base64Encode(str: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  let binaryStr = "";
  for (let i = 0; i < data.length; i++) {
    binaryStr += String.fromCharCode(data[i]);
  }
  return window.btoa(binaryStr);
}

function base64Decode(base64: string) {
  const binaryStr = window.atob(base64);
  const bytes = new Uint8Array(
    [...binaryStr].map((char) => char.charCodeAt(0))
  );
  return new TextDecoder().decode(bytes);
}

const handleResponse = async (res: any) => {
  if (!res.ok) {
    return res.text().then((error: any) => {
      throw new Error(error);
    });
  }
  return res.blob();
};

const createBody = (data: any) => {
  const formData = new FormData();
  formData.append("audio", data, "audio.wav");
  return formData;
};

const handleSuccess = async (blob: any) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  stopSourceIfNeeded();

  source = audioContext.createBufferSource();
  source.buffer = await audioContext.decodeAudioData(await blob.arrayBuffer());
  source.connect(audioContext.destination);
  source.start(0);
  sourceIsStarted = true;
  source.onended = particleActions.reset;

  particleActions.onAiSpeaking();
};

const handleError = (error: any) => {
  console.log(`error encountered: ${error.message}`);
  particleActions.reset();
};

const validate = async (data: any) => {
  const decodedData = await new AudioContext().decodeAudioData(
    await data.arrayBuffer()
  );
  const duration = decodedData.duration;
  const minDuration = 0.4;

  if (duration < minDuration)
    throw new Error(
      `Duration is ${duration}s, which is less than minimum of ${minDuration}s`
    );
};
