type FeedbackToastProps = {
  message: string;
  tone: "success" | "error";
};

export function FeedbackToast({ message, tone }: FeedbackToastProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center px-5">
      <div
        className={`max-w-xl rounded-[1.5rem] px-5 py-3 text-center text-sm font-black text-white shadow-2xl backdrop-blur sm:px-6 sm:py-3.5 sm:text-base ${
          tone === "success"
            ? "bg-emerald-500/95 shadow-emerald-200"
            : "bg-rose-500/95 shadow-rose-200"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
