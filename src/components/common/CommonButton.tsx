type ButtonProps = {
  label: string;
  onClick?: () => void;
  fullWidth?: boolean;
  variant?: "filled" | "outline" | "light";
  size?: "sm" | "md" | "lg" | "xs";
  type?: "button" | "submit" | "reset";
  color?: "primary" | "secondary" | "destructive" | string;
  disabled?: boolean;
  className?: string;
};

const CommonButton = ({
                        label,
                        onClick,
                        fullWidth = true,
                        variant = "filled",
                        size = "md",
                        type = "button",
                        color = "primary",
                        disabled = false,
                        className = "",
                      }: ButtonProps) => {
  const base =
    "inline-flex justify-center items-center font-semibold rounded-full backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const width = fullWidth ? "w-full" : "w-auto";

  const sizeMap: Record<string, string> = {
    xs: "px-4 py-1.5 text-xs",
    sm: "px-5 py-2 text-sm",
    md: "px-6 py-2.5 text-base shadow-sm hover:shadow-md",
    lg: "px-8 py-3.5 text-lg shadow-sm hover:shadow-md",
  };

  const colorMap: Record<string, string> = {
    primary: "bg-primary/90 text-primary-foreground hover:bg-primary",
    secondary: "bg-secondary/90 text-secondary-foreground hover:bg-secondary",
    destructive: "bg-destructive/90 text-destructive-foreground hover:bg-destructive",
  };

  const isCustomColor =
    color && !["primary", "secondary", "destructive"].includes(color);

  const variantMap: Record<string, string> = {
    filled: isCustomColor ? "" : colorMap[color],
    outline: "border border-border/80 bg-background/20 text-foreground hover:bg-muted/50",
    light: "bg-muted/50 text-foreground hover:bg-muted hover:text-primary",
  };

  const style = isCustomColor
    ? variant === "filled"
      ? { backgroundColor: color, color: "#fff" }
      : variant === "outline"
        ? { border: `1px solid ${color}`, color }
        : { backgroundColor: `${color}1A`, color }
    : undefined;

  return (
    <button
      onClick={onClick}
      type={type}
      style={style}
      disabled={disabled}
      className={`${base} ${width} ${sizeMap[size]} ${variantMap[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default CommonButton;