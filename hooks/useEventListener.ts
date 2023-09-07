"use client";

import { useEffect, useRef } from "react";

export const useEventListener = (
  eventType: keyof globalThis.WindowEventMap,
  callback: (e?: Event) => void,
  element: Window = window
) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (element == null) return () => undefined;
    const handler: Parameters<Window["addEventListener"]>[1] = e =>
      callbackRef.current(e);
    element.addEventListener(eventType, handler);

    return () => {
      element.removeEventListener(eventType, handler);
    };
  }, [eventType, element]);
};
