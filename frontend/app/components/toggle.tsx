"use client";

interface IToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const Toggle = ({ checked, onChange, className = "" }: IToggleProps) => {
  return (
    <input
      type="checkbox"
      className={`toggle ${className}`}
      checked={checked}
      onChange={() => onChange(!checked)}
    />
  );
};

export default Toggle;
