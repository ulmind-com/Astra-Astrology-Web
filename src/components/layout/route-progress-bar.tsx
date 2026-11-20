"use client";

import { usePathname, useSearchParams } from "next/navigation";
import * as React from "react";

export function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  // When pathname or search params change, route navigation finished
  React.useEffect(() => {
    if (active) {
      setProgress(100);
      const timer = setTimeout(() => {
        setActive(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Global click interceptor for internal links to trigger the bar immediately
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target || !target.href) return;
      try {
        const url = new URL(target.href, window.location.origin);
        // Only internal links, not hashes, not target="_blank"
        if (
          url.origin === window.location.origin &&
          target.target !== "_blank" &&
          !target.hasAttribute("download") &&
          (url.pathname !== window.location.pathname || url.search !== window.location.search)
        ) {
          setActive(true);
          setProgress(25);
          setTimeout(() => setProgress(65), 100);
          setTimeout(() => setProgress(85), 350);
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    window.addEventListener("click", handleClick, { capture: true });
    return () => window.removeEventListener("click", handleClick, { capture: true });
  }, []);

  if (!active && progress === 0) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[99999] pointer-events-none h-[2.5px] bg-transparent overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.8)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
