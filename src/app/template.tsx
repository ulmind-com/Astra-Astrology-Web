/**
 * Re-mounted by the App Router on every navigation, which is what makes a
 * single CSS class enough to give the whole app a page transition.
 *
 * A server component on purpose: it renders the same markup on both sides, so
 * it adds no client JavaScript and cannot cause a hydration mismatch. The
 * wrapper sets no size of its own, so it does not disturb the `min-h-screen`
 * each page sets for itself.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
