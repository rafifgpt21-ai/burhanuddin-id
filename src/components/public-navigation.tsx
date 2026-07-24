"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationItem = {
  href: string;
  label: string;
};

export function PublicNavigation({
  items,
  label,
  className,
}: {
  items: readonly NavigationItem[];
  label: string;
  className: string;
}) {
  const pathname = usePathname();

  return (
    <nav className={className} aria-label={label}>
      {items.map((item) => {
        const current =
          pathname === item.href ||
          (item.href.split("/").filter(Boolean).length > 1 &&
            pathname.startsWith(`${item.href}/`));

        return (
          <Link
            href={item.href}
            key={item.href}
            aria-current={current ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
