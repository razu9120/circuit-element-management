interface IBadgeProps {
  label: string;
  color?: string;
}

const Badge: React.FC<IBadgeProps> = ({
  label,
  color = "badge-primary",
  ...props
}) => {
  return (
    <div className={`badge ${color} badge-sm text-xs pr-2 pl-2`} {...props}>
      {label}
    </div>
  );
};

export default Badge;
