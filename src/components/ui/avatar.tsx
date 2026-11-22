"use client";

import Image from "next/image";
import * as React from "react";

import { cn, initials } from "@/lib/utils";

const SIZES = { sm: 32, md: 44, lg: 64, xl: 112 } as const;

export function Avatar({
  src,
  name,
  size = "md",
  className,
}: {
  src?: string | null;
  name?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    setFailed(false);
  }, [src]);

  const px = SIZES[size];
  const showImage = Boolean(src && src.trim() !== "") && !failed;
  // When the caller sizes the Avatar through className (e.g. "size-full" to fill
  // a wrapper), don't pin a fixed width/height — the inline style would override
  // the class and crop the image. `size` then only scales the initials fallback.
  const fillsParent = Boolean(className && /\bsize-full\b/.test(className));

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-gradient-to-tr from-amber-500 to-yellow-500",
        "font-bold text-white ring-1 ring-amber-300/80",
        "shadow-xs select-none",
        className,
      )}
      style={fillsParent ? { fontSize: px * 0.38 } : { width: px, height: px, fontSize: px * 0.38 }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt=""
          className="size-full object-cover"
          onError={() => setFailed(true)}
          loading="eager"
          referrerPolicy="no-referrer"
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}
