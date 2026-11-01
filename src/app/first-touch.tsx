"use client";

import { useEffect } from "react";

import { captureFirstTouch } from "@/lib/attribution";

/** Records how the visitor arrived, in their own browser. See lib/attribution. */
export function FirstTouch() {
  useEffect(() => {
    captureFirstTouch();
  }, []);
  return null;
}
