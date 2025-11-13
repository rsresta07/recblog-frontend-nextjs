type ButtonProps = {
  label: string;
  onClick?: () => void;
  fullWidth?: boolean;
  variant?: "filled" | "outline" | "light";
  radius?: "sm" | "md" | "lg";
  size?: "sm" | "md" | "lg" | "xs";
  type?: "button" | "submit" | "reset";
  color?: "primary" | "secondary" | "destructive" | string;
};

/**
 * A reusable button component styled with Tailwind.
 * Supports both theme colors and custom color codes (hex, rgb, etc).
 */
const CommonButton = ({
  label,
  onClick,
  fullWidth = true,
  variant = "filled",
  radius = "md",
  size = "md",
  type = "button",
  color = "primary",
}: ButtonProps) => {
  const base =
    "font-medium transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2";
  const width = fullWidth ? "w-full" : "w-auto";

  const radiusMap: Record<string, string> = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
  };

  const sizeMap: Record<string, string> = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const colorMap: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-accent",
    secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
    destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
  };

  const isCustomColor =
    color && !["primary", "secondary", "destructive"].includes(color);

  const variantMap: Record<string, string> = {
    filled: isCustomColor ? "" : `${colorMap[color]}`,
    outline: "border border-border text-foreground hover:bg-muted",
    light: "bg-muted text-foreground hover:bg-accent",
  };

  const style = isCustomColor
    ? variant === "filled"
      ? { backgroundColor: color, color: "#fff" }
      : variant === "outline"
        ? { border: `1px solid ${color}`, color }
        : { backgroundColor: `${color}1A`, color } // light variant
    : undefined;

  return (
    <button
      onClick={onClick}
      type={type}
      style={style}
      className={`${base} ${width} ${radiusMap[radius]} ${sizeMap[size]} ${variantMap[variant]}`}
    >
      {label}
    </button>
  );
};

export default CommonButton;
