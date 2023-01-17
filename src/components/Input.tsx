export interface InputProps {
  id?: string;
  label: string;

  value: string;
  setValue: (newValue: string) => void;

  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function Input({
  id,
  label,
  value,
  setValue,
  placeholder,
  error,
  disabled,
}: InputProps) {
  const inputId = `${id}-${label}-input`;

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex flex-row gap-2 items-center">
        <label htmlFor={inputId}>{label}</label>
        <input
          id={inputId}
          className="grow p-1 border-2 border-indigo-300 disabled:border-gray-300 disabled:text-gray-300"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>

      {error && <p className="text-sm text-red-600 text-right">{error}</p>}
    </div>
  );
}
