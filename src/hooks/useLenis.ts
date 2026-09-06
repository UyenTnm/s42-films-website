"use client";

import { useSyncExternalStore } from "react";
import type Lenis from "lenis";

let globalLenis: Lenis | null = null;
const listeners = new Set<() => void>();

export function setGlobalLenis(instance: Lenis | null) {
  globalLenis = instance;
  listeners.forEach((listener) => listener());
}

export function getGlobalLenis(): Lenis | null {
  return globalLenis;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Hook to access the active Lenis smooth-scroll instance
 */
export function useLenis(): Lenis | null {
  return useSyncExternalStore(
    subscribe,
    getGlobalLenis,
    () => null
  );
}
