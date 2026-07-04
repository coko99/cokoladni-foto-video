"use client";

type Option = {
  value: string;
  label: string;
};

type OptionPickerProps = {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  accent?: "cyan" | "green";
};

export function OptionPicker({
  label,
  options,
  value,
  onChange,
  required,
  placeholder = "Izaberi opciju",
  accent = "cyan",
}: OptionPickerProps) {
  const selected = accent === "green";
  const labelColor = selected ? "text-[#25D366]" : "text-accent";
  const activeClass = selected
    ? "border-[#25D366]/60 bg-[#25D366]/15 text-[#25D366]"
    : "border-accent/50 bg-accent/15 text-accent";
  const idleClass = selected
    ? "border-white/10 bg-white/5 text-text-muted hover:border-[#25D366]/30 hover:text-[#25D366]"
    : "border-white/10 bg-white/5 text-text-muted hover:border-accent/30 hover:text-accent";

  return (
    <div>
      <p className={`mb-2 text-[10px] font-semibold uppercase tracking-wider ${labelColor}`}>
        {label}
        {required ? " *" : ""}
      </p>
      <div className="flex flex-wrap gap-2" role="listbox" aria-label={label}>
        {options.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={isActive}
              onClick={() => onChange(isActive && !required ? "" : opt.value)}
              className={`rounded-full border px-3 py-2 text-left text-xs transition sm:text-sm ${
                isActive ? activeClass : idleClass
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {!value && required && (
        <p className="mt-1.5 text-[10px] text-text-dim">{placeholder}</p>
      )}
    </div>
  );
}
