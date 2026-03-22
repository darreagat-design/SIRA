type FeedbackTone = "success" | "error" | "info" | "warning";

const toneStyles: Record<FeedbackTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
  info: "border-sky-200 bg-sky-50 text-sky-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
};

type FeedbackAlertProps = {
  title: string;
  message: string;
  tone?: FeedbackTone;
};

export function FeedbackAlert({
  title,
  message,
  tone = "info",
}: FeedbackAlertProps) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneStyles[tone]}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-6 opacity-90">{message}</p>
    </div>
  );
}
