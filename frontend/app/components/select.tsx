import React from "react";

interface Option {
  value: number;
  label: string;
}

interface SelectProps {
  label?: string;
  options: Option[];
  value: number;
  defaultValue?: number;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  className = "",
}) => {
  const firstOption = { value: 0, label: "" };
  const newOptions = [firstOption, ...options];
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <select
        className={`select select-bordered ${className}`}
        value={value}
        onChange={onChange}
      >
        {newOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
