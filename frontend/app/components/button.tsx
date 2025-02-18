interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

const Button: React.FC<IButtonProps> = ({ label, ...props }) => {
  return (
    <div>
      <button {...props}>{label}</button>
    </div>
  );
};

export default Button;
