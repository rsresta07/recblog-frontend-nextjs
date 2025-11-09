type ButtonProps = {
  label: string;
  onClick?: () => void;
  fullWidth?: boolean;
  variant?: "filled" | "outline" | "light";
  radius?: string;
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  color?: "primary" | "secondary" | "destructive";
};

/**
 * A reusable button component using native <button>, styled with Tailwind and theme tokens.
 *
 * Defaults:
 * - fullWidth: true
 * - variant: filled
 * - color: primary
 * - size: md
 * - radius: md
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
  const base = `font-medium transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2`;
  const width = fullWidth ? "w-full" : "w-auto";

  const radiusMap: Record<string, string> = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
  };

  const sizeMap: Record<string, string> = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const colorMap: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-accent",
    secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
    destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
  };

  const variantMap: Record<string, string> = {
    filled: `${colorMap[color]}`,
    outline: `border border-border text-foreground hover:bg-muted`,
    light: `bg-muted text-foreground hover:bg-accent`,
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className={`${base} ${width} ${radiusMap[radius]} ${sizeMap[size]} ${variantMap[variant]}`}
    >
      {label}
    </button>
  );
};

export default CommonButton;
