import "./Button.scss"

const Button = ({
  variant = "main",
  size = "medium",
  type = "button",
  disabled = false,
  children,
  onClick,
  className = "",
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
    }
    onClick?.(e);
  };

  return (
    <button
      type={type}
      className={`button ${variant} ${size} ${className} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button