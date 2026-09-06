"use client";

import { useLayoutEffect, useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

// Use useLayoutEffect in browser, useEffect in SSR
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Custom hook to safely scope GSAP animations with automatic cleanup using gsap.context()
 *
 * @param callback - function configuring GSAP animations/timelines
 * @param scope - optional RefObject or element to scope selector queries
 * @param deps - dependency array to trigger recreation
 */
export function useGSAPContext(
  callback: (context: gsap.Context) => void,
  scope?: RefObject<HTMLElement | null> | HTMLElement | null,
  deps: unknown[] = []
) {
  const callbackRef = useRef(callback);

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  });

  useIsomorphicLayoutEffect(() => {
    const scopeElement =
      scope && "current" in scope ? scope.current : (scope as HTMLElement | null);

    const ctx = gsap.context((self) => {
      callbackRef.current(self);
    }, scopeElement || undefined);

    return () => {
      ctx.revert();
    };
  }, deps);
}
