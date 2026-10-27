export function GridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true" aria-label="Yükleniyor">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl bg-cream-200" style={{ aspectRatio: "4 / 6" }} />
      ))}
    </div>
  );
}
