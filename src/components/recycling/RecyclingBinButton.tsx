import { CategoryInfo } from "@/lib/recycling/types";

type RecyclingBinButtonProps = {
  info: CategoryInfo;
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
};

export function RecyclingBinButton({
  info,
  label = "선택하기",
  disabled,
  onClick,
  className = "",
  children,
}: RecyclingBinButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-[1.5rem] bg-gradient-to-br ${info.color} p-[1px] text-left transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      <div className="flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
            {info.emoji}
          </div>
          <div>
            <p className="text-lg font-black text-slate-900">{info.label}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{info.description}</p>
        {children ? <div className="mt-4">{children}</div> : null}
      </div>
    </button>
  );
}
