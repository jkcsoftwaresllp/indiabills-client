// Replacement for @mui/material Avatar
export const Avatar = ({
  src,
  alt = '',
  children,
  className = '',
  sx = {},
  ...props
}) => {
  const sizeMap = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
  };

  const size = props.variant || 'medium';
  const sizeClass = sizeMap[size] || 'w-10 h-10';

  return (
    <div
      className={`${sizeClass} rounded-full bg-gray-300 flex items-center justify-center overflow-hidden text-white font-bold ${className}`}
      style={sx}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        children || alt.charAt(0)
      )}
    </div>
  );
};

export default Avatar;
