"use client";

export function PreviewLink({
  className,
  href,
  label = "Preview",
}: {
  className?: string;
  href: string;
  label?: string;
}) {
  return (
    <button
      className={className}
      type="button"
      onClick={() => {
        const separator = href.includes("?") ? "&" : "?";
        window.open(
          `${href}${separator}expires=${Date.now() + 15 * 60 * 1000}`,
          "_blank",
          "noopener,noreferrer",
        );
      }}
    >
      {label}
    </button>
  );
}
