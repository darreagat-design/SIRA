type Space = {
  id: string;
  nombre: string;
  tipo: string;
  ubicacion: string;
  capacidad: number;
  descripcion: string;
  activo: boolean;
};

type SpaceListProps = {
  spaces: Space[];
  emptyTitle: string;
  emptyDescription: string;
};

export function SpaceList({
  spaces,
  emptyTitle,
  emptyDescription,
}: SpaceListProps) {
  if (!spaces.length) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/70 px-6 py-10 text-center">
        <h3 className="text-lg font-semibold text-slate-900">{emptyTitle}</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {spaces.map((space) => (
        <article
          key={space.id}
          className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-5 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                {space.tipo}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{space.nombre}</h3>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              {space.capacidad} personas
            </span>
          </div>

          <p className="mt-3 text-sm font-medium text-slate-600">{space.ubicacion}</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">{space.descripcion}</p>
        </article>
      ))}
    </div>
  );
}
