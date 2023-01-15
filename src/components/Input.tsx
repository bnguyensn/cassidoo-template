export interface InputProps {
  label: string;

  value: string;
  setValue: (newValue: string) => void;

  error?: string;
}

export function Input({ label, value, setValue, error }: InputProps) {
  const inputId = `${label}-input`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row gap-2 items-center">
        <label htmlFor={inputId}>{label}</label>
        <input
          id={inputId}
          className="border-2 border-indigo-300 p-1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-600 text-right">{error}</p>}
    </div>
  );
}
