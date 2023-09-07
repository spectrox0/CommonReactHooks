import { useEffect, useState } from "react";
import { useEventListener } from "./useEventListener";

// void file
const PING_RESOURCE = "/ping.txt";
const TIMEOUT_TIME_MS = 3000;
const onlinePollingInterval = 10000;

const timeout = (time: number, promise: Promise<Response>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out."));
    }, time);
    promise.then(resolve, reject);
  });
};

const checkOnlineStatus = async () => {
  const controller = new AbortController();
  const { signal } = controller;

  // If the browser has no network connection return offline
  if (!navigator.onLine) return navigator.onLine;

  //
  try {
    await timeout(
      TIMEOUT_TIME_MS,
      fetch(PING_RESOURCE, {
        method: "GET",
        signal,
      })
    );
    return true;
  } catch (error) {
    // This can be because of request timed out
    // so we abort the request for any case
    controller.abort();
  }
  return false;
};
export const useOnlineStatus = () => {
  const [online, setOnline] = useState<boolean>(false);
  useEventListener("online", async () => setOnline(true));
  useEventListener("offline", () => setOnline(false));
  useEffect(() => {
    const interval = setInterval(async () => {
      const status = await checkOnlineStatus();
      setOnline(status);
    }, onlinePollingInterval);
    return () => clearInterval(interval);
  }, []);

  return { online };
};
