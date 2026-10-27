import { Breadcrumbs } from "./Breadcrumbs";

export function PageHero({
  title,
  description,
  eyebrow,
  crumbs,
  children,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  crumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-grain border-b border-espresso-900/5">
      <div className="container-x py-10 sm:py-14">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className="mt-5 max-w-3xl">
          {eyebrow && (
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-caramel-600">{eyebrow}</p>
          )}
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-espresso-900 text-balance sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-lg leading-relaxed text-espresso-700 text-pretty">{description}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
