"use client";

import { useEffect, useRef, useState } from "react";

// Cloudflare Turnstile ("I'm not a robot" check), dark theme, full width.
// Env: NEXT_PUBLIC_TURNSTILE_SITE_KEY. Without it the widget renders nothing.

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let loading: Promise<void> | null = null;

function loadScript() {
  if (window.turnstile) return Promise.resolve();
  if (!loading) {
    loading = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        loading = null;
        reject(new Error("Turnstile script failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return loading;
}

export default function TurnstileWidget({
  onToken,
  resetKey,
}: {
  onToken: (token: string | null) => void;
  /** Increase to get a fresh check (a token can be used only once). */
  resetKey: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const callback = useRef(onToken);
  callback.current = onToken;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "dark",
          size: "flexible",
          action: "careers-apply",
          callback: (token: string) => {
            setFailed(false);
            callback.current(token);
          },
          "expired-callback": () => callback.current(null),
          "error-callback": () => {
            callback.current(null);
            setFailed(true);
          },
        });
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (resetKey > 0 && widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current);
      callback.current(null);
    }
  }, [resetKey]);

  if (!TURNSTILE_SITE_KEY) return null;

  return (
    <div className="mb-5">
      <div ref={containerRef} className="min-h-[65px]" />
      {failed && (
        <p className="mt-2 text-sm text-[#ffb4ad]">
          The security check could not load. Please refresh the page, or turn
          off any ad blocker for this site.
        </p>
      )}
    </div>
  );
}
