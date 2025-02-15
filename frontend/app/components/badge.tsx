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
    <div
      className={`badge badge-${color} badge-sm text-xs text-white pr-2 pl-2`}
      {...props}
    >
      {label}
    </div>
  );
};

export default Badge;
