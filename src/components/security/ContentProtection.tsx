"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Deterrents only: they stop casual copying and saving, but no website can
// fully block screenshots. The viewer watermark is what makes leaks traceable.

const EDITABLE = "input, textarea, [contenteditable='true']";

function isEditable(target: EventTarget | null) {
  return target instanceof Element && target.closest(EDITABLE) !== null;
}

export default function ContentProtection() {
  const pathname = usePathname();
  // Keep the login page usable: people switch to their mailbox to read the code.
  const hideOnBlur = pathname !== "/access";

  useEffect(() => {
    const root = document.documentElement;
    const block = (event: Event) => {
      if (!isEditable(event.target)) event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const mod = event.ctrlKey || event.metaKey;

      if (key === "f12") return event.preventDefault();
      if (
        mod &&
        event.shiftKey &&
        ["i", "j", "c", "s", "4", "3", "5"].includes(key)
      ) {
        return event.preventDefault();
      }
      if (mod && ["s", "p", "u"].includes(key)) return event.preventDefault();
      if (mod && ["c", "x", "a"].includes(key) && !isEditable(event.target)) {
        return event.preventDefault();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key !== "PrintScreen") return;
      void navigator.clipboard?.writeText("").catch(() => {});
      root.classList.add("s42-shield");
      window.setTimeout(() => root.classList.remove("s42-shield"), 1500);
    };

    const shieldOn = () => {
      if (hideOnBlur) root.classList.add("s42-shield");
    };
    const shieldOff = () => root.classList.remove("s42-shield");
    const onVisibility = () => (document.hidden ? shieldOn() : shieldOff());

    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("selectstart", block);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", shieldOn);
    window.addEventListener("focus", shieldOff);

    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("selectstart", block);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      // iOS Safari ignores user-scalable=no, so cancel its pinch gesture.
      document.addEventListener("gesturestart", block);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", shieldOn);
      window.removeEventListener("focus", shieldOff);
      shieldOff();
    };
  }, [hideOnBlur]);

  return null;
}
