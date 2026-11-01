"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Tag to render. A section or li often reads better than a div. */
  as?: "div" | "section" | "li" | "article";
  /** Delay before this element starts, in ms. For hand-ordering a few siblings. */
  delay?: number;
  /**
   * Animate the direct children one after another instead of the wrapper.
   * The wrapper keeps its own layout classes and stays fully opaque, so this
   * is safe to put straight on a grid.
   */
  stagger?: boolean;
  /**
   * How far into the viewport the element must come before it starts. The
   * default fires slightly early so the motion has finished by the time the
   * element is properly in view, rather than animating under the reader's eye.
   */
  margin?: string;
};

/**
 * Plays the shared entrance animation the first time this element scrolls into
 * view, then stops observing.
 *
 * Why an observer rather than a CSS-only animation: a page of twenty cards
 * that all animate at load has finished before the reader scrolls to card
 * eleven, so the motion is wasted and the page feels static below the fold.
 *
 * Three things keep it safe to use anywhere:
 *
 *   * it renders the same markup on the server and on the first client render,
 *     so it cannot cause a hydration mismatch;
 *   * if `IntersectionObserver` is missing it shows the content immediately
 *     rather than hiding it forever;
 *   * it only ever adds a class, so the element's layout is untouched and
 *     nothing below it can shift.
 *
 * The element is held in state rather than a ref on purpose. A ref does not
 * re-run the effect when it is populated, so the observer has to be set up
 * against whatever `ref.current` happens to be at that moment; state makes the
 * effect run again the instant the node exists, which is the difference
 * between this working and silently never firing.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  stagger = false,
  margin = "0px 0px -8% 0px",
  style,
  ...rest
}: RevealProps) {
  const [node, setNode] = React.useState<HTMLElement | null>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    if (!node || shown) return;

    // Already scrolled past: the element sits entirely above the viewport and
    // will never come back into it. That is the case on a hash link, on
    // restored scroll after a back navigation, and on a reload partway down
    // the page.
    const passed = () => node.getBoundingClientRect().bottom <= 0;

    // A browser without the observer should just show the content. Deferred
    // to the next frame so the state change comes from a callback rather than
    // straight out of the effect body.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // The observer's first callback reports the element's current
        // position, so this also catches an element that was already above
        // the viewport when we started watching.
        const reached = entries.some(
          (entry) => entry.isIntersecting || entry.boundingClientRect.bottom <= 0,
        );
        if (reached) {
          setShown(true);
          cleanup();
        }
      },
      { rootMargin: margin, threshold: 0.01 },
    );

    // The observer only reports a threshold being crossed. A jump that moves
    // the element from below the viewport to above it in one frame — an
    // in-page anchor, a programmatic scroll — crosses nothing, so the
    // observer stays silent and the element would never appear. This catches
    // exactly that: one cheap read, only while the element is still hidden.
    const onScroll = () => {
      if (passed()) {
        setShown(true);
        cleanup();
      }
    };

    function cleanup() {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    }

    observer.observe(node);
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, [node, shown, margin]);

  // `Tag` is one of four intrinsic elements, so the prop types differ per tag
  // while the props themselves are the shared HTML set. One cast at the
  // boundary beats four near-identical branches.
  const Element = Tag as "div";

  return (
    <Element
      ref={setNode as never}
      className={cn(
        // With `stagger` the children carry the animation, so the wrapper
        // must not be hidden itself — it would hide them along with it.
        stagger ? "stagger-group" : "reveal",
        shown && "reveal-in",
        className,
      )}
      style={delay ? { ...style, animationDelay: `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Element>
  );
}
