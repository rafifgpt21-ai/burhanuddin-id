"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type AdminNavigationItem = {
  href: string;
  label: string;
  meta: string;
};

export function AdminNavigation({
  items,
  label,
}: {
  items: AdminNavigationItem[];
  label: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label}>
      {items.map((item) => {
        const isCurrent =
          pathname === item.href ||
          (item.href.split("/").length > 3 && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            aria-current={isCurrent ? "page" : undefined}
            href={item.href}
            key={item.href}
          >
            <strong>{item.label}</strong>
            <small>{item.meta}</small>
          </Link>
        );
      })}
    </nav>
  );
}
