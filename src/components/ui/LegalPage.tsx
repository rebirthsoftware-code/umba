import { PageHero } from "./PageHero";

export function LegalPage({
  title,
  description,
  updated = "1 Ekim 2026",
  children,
}: {
  title: string;
  description?: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero title={title} description={description} eyebrow="Yasal" crumbs={[{ label: title }]} />
      <article className="container-x py-10 sm:py-14">
        <div className="prose-legal max-w-3xl">
          <p className="text-sm text-espresso-600">Son güncelleme: {updated}</p>
          {children}
        </div>
      </article>
    </>
  );
}
