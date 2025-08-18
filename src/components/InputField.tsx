import React, { useId, useMemo, useState } from "react";
import './components.css'; 
import "tailwindcss/tailwind.css"; 
import './DataTable.tsx'; 

type Variant = "filled" | "outlined" | "ghost";
type Size = "sm" | "md" | "lg";

export interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  variant?: Variant;
  size?: Size;

  clearable?: boolean;
 
  passwordToggle?: boolean;

  type?: React.HTMLInputTypeAttribute;


}




export const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled = false,
  invalid = false,
  variant = "outlined",
  size = "md",
  clearable = false,
  passwordToggle = false,
  type = "text",
}) => {
  // Support controlled (value provided) and uncontrolled (value undefined) usage
  const [innerValue, setInnerValue] = useState<string>("");
  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value as string) : innerValue;

  const [showPassword, setShowPassword] = useState(false);

  const inputId = useId();
  const helpId = useId();

  const classRoot = "if-root";
  const classInput = useMemo(() => {
    const base = ["if-input", `if-${variant}`, `if-${size}`];
    if (invalid) base.push("if-invalid");
    if (disabled) base.push("if-disabled");
    return base.join(" ");
  }, [variant, size, invalid, disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInnerValue(e.target.value);
    onChange?.(e);
  };

  const inputType =
    passwordToggle && (type === "password" || type === "text")
      ? showPassword
        ? "text"
        : "password"
      : type;

  const describedBy =
    invalid && errorMessage
      ? helpId
      : helperText
      ? helpId
      : undefined;


  return (
    <div className={classRoot}>
      {label && (
        <label className="if-label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className="if-field">
        <input
          id={inputId}
          className={classInput}
          type={inputType}
          placeholder={placeholder}
          value={currentValue}
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
        />

        {/* Clear */}
        {clearable && !!currentValue && !disabled && (
          <button
            type="button"
            className="if-clear"
            aria-label="Clear input"
            onClick={() => {
              const next = "";
              if (!isControlled) setInnerValue(next);
             
              onChange?.({
                target: { value: next },
              } as unknown as React.ChangeEvent<HTMLInputElement>);
            }}
          >
            ×
          </button>
        )}

        {/* Password toggle */}
        {passwordToggle && (type === "password" || type === "text") && (
          <button
            type="button"
            className="if-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>

      {/* Helper / Error */}
      {invalid && errorMessage ? (
        <div id={helpId} className="if-help if-error" role="alert">
          {errorMessage}
        </div>
      ) : helperText ? (
        <div id={helpId} className="if-help">
          {helperText}
        </div>
      ) : null}
    </div>
  );
};

export default InputField;
