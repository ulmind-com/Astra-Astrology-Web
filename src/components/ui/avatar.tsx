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
  const px = SIZES[size];
  const showImage = Boolean(src) && !failed;
  // When the caller sizes the Avatar through className (e.g. "size-full" to fill
  // a wrapper), don't pin a fixed width/height — the inline style would override
  // the class and crop the image. `size` then only scales the initials fallback.
  const fillsParent = Boolean(className && /\bsize-full\b/.test(className));

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-gradient-to-br from-brand-200/70 to-brand-100/80",
        "font-semibold text-ink-800 ring-1 ring-brand-500/35",
        "shadow-soft",
        className,
      )}
      style={fillsParent ? { fontSize: px * 0.36 } : { width: px, height: px, fontSize: px * 0.36 }}
    >
      {showImage ? (
        <Image
          src={src!}
          alt={name ?? "Profile picture"}
          width={px}
          height={px}
          className="size-full object-cover"
          onError={() => setFailed(true)}
          unoptimized
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}
