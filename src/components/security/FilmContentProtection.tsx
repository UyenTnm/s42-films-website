"use client";

import { useEffect } from "react";

const EDITABLE = "input, textarea, [contenteditable='true']";

function isEditable(target: EventTarget | null) {
  return target instanceof Element && target.closest(EDITABLE) !== null;
}

/**
 * Discourages casual copying, saving, printing, and screen capture on film
 * routes. Browser-side protection cannot prevent a determined user from
 * photographing or otherwise recording content.
 */
export default function FilmContentProtection() {
  useEffect(() => {
    const root = document.documentElement;
    const block = (event: Event) => {
      if (!isEditable(event.target)) event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (typeof event.key !== "string") return;

      const key = event.key.toLowerCase();
      const modifier = event.ctrlKey || event.metaKey;

      if (key === "f12") {
        event.preventDefault();
        return;
      }

      if (
        modifier &&
        event.shiftKey &&
        ["i", "j", "c", "s", "3", "4", "5"].includes(key)
      ) {
        event.preventDefault();
        return;
      }

      if (modifier && ["s", "p", "u"].includes(key)) {
        event.preventDefault();
        return;
      }

      if (
        modifier &&
        ["a", "c", "x"].includes(key) &&
        !isEditable(event.target)
      ) {
        event.preventDefault();
      }
    };

    const shieldOn = () => root.classList.add("s42-film-shield");
    const shieldOff = () => root.classList.remove("s42-film-shield");
    const onVisibilityChange = () =>
      document.hidden ? shieldOn() : shieldOff();

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key !== "PrintScreen") return;

      void navigator.clipboard?.writeText("").catch(() => {});
      shieldOn();
      window.setTimeout(shieldOff, 1500);
    };

    root.classList.add("s42-film-protection-active");

    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("selectstart", block);
    document.addEventListener("gesturestart", block);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", shieldOn);
    window.addEventListener("focus", shieldOff);
    window.addEventListener("beforeprint", shieldOn);
    window.addEventListener("afterprint", shieldOff);

    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("selectstart", block);
      document.removeEventListener("gesturestart", block);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", shieldOn);
      window.removeEventListener("focus", shieldOff);
      window.removeEventListener("beforeprint", shieldOn);
      window.removeEventListener("afterprint", shieldOff);

      root.classList.remove("s42-film-protection-active");
      shieldOff();
    };
  }, []);

  return null;
}
