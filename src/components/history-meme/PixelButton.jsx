export default function PixelButton({
  children,
  className = '',
  variant = 'primary',
  ...props
}) {
  return (
    <button
      type="button"
      className={`history-pixel-button history-pixel-button--${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
