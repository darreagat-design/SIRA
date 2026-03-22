type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
