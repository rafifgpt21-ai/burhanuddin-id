"use client";

export function PreviewLink({
  className,
  disabled = false,
  href,
  label = "Preview",
}: {
  className?: string;
  disabled?: boolean;
  href: string;
  label?: string;
}) {
  return (
    <button
      className={className}
      disabled={disabled}
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
