interface BadgeProps {
  label: string;
  color?: string;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  color = "primary",
  ...props
}) => {
  return (
    <div>
      <div
        className={`bg-${color} rounded-box text-xs text-white pr-2 pl-2`}
        {...props}
      >
        {label}
      </div>
    </div>
  );
};

export default Badge;
