import { CategoryInfo } from "@/lib/recycling/types";

type RecyclingBinButtonProps = {
  info: CategoryInfo;
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  compact?: boolean;
};

export function RecyclingBinButton({
  info,
  label = "선택하기",
  disabled,
  onClick,
  className = "",
  children,
  compact = false,
}: RecyclingBinButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-[1.5rem] bg-gradient-to-br ${info.color} p-[1px] text-left transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      <div className={`flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-white ${compact ? "p-4" : "p-5"}`}>
        <div className={`flex items-center ${compact ? "gap-2.5" : "gap-3"}`}>
          <div
            className={`flex items-center justify-center rounded-2xl bg-slate-100 ${
              compact ? "h-10 w-10 text-xl" : "h-12 w-12 text-2xl"
            }`}
          >
            {info.emoji}
          </div>
          <div>
            <p className={`${compact ? "text-base" : "text-lg"} font-black text-slate-900`}>{info.label}</p>
            {label ? <p className="text-xs text-slate-500 sm:text-sm">{label}</p> : null}
          </div>
        </div>
        <p className={`text-slate-600 ${compact ? "mt-3 text-xs leading-5" : "mt-4 text-sm leading-6"}`}>
          {info.description}
        </p>
        {children ? <div className={compact ? "mt-3" : "mt-4"}>{children}</div> : null}
      </div>
    </button>
  );
}
