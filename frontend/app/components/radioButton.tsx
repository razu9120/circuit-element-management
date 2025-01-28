import React from "react";

// Propsの型を定義
interface RadioOption {
  value: string;
  label: string;
}

interface RadioButtonProps {
  name: string; // ラジオボタンのname属性
  options: RadioOption[]; // オプションの配列
  defaultValue?: string; // デフォルトで選択される値
  onChange?: (value: string) => void; // 値が変更されたときのコールバック関数
}

const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  options,
  defaultValue,
  onChange,
}) => {
  return (
    <div className="md:flex mb-2">
      {options.map((option) => (
        <label key={option.value} className="label cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            className="radio radio-sm md:radio-md radio-accent"
            defaultChecked={defaultValue === option.value}
            onChange={(e) => onChange && onChange(e.target.value)}
          />
          <span className="label-text mr-4 ml-2">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioButton;
