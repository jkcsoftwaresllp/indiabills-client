// Replacement for @mui/material CircularProgress
export const CircularProgress = ({ size = 40, sx = {} }) => {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60,
  };
  
  const actualSize = typeof size === 'string' ? sizeMap[size] || 40 : size;
  
  return (
    <div
      style={{
        width: actualSize,
        height: actualSize,
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderTop: '4px solid #1976d2',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        ...sx,
      }}
    >
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CircularProgress;
