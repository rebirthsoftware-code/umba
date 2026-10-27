import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Sayfa yolu" className="text-sm text-espresso-600">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-espresso-900">
            Ana Sayfa
          </Link>
        </li>
        {items.map((item, i) => (
          <Fragment key={`${item.label}-${i}`}>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li aria-current={i === items.length - 1 ? "page" : undefined}>
              {item.href ? (
                <Link href={item.href} className="hover:text-espresso-900">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-espresso-900">{item.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
