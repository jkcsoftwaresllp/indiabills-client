// Replacement for @mui/material Stepper components
export const Stepper = ({
  activeStep = 0,
  children,
  className = '',
  sx = {},
  ...props
}) => (
  <div className={`flex items-center gap-4 mb-6 ${className}`} style={sx} {...props}>
    {children}
  </div>
);
export const Step = ({ completed = false, active = false, children, className = '', ...props }) => (
  <div className={`flex items-center ${className}`} {...props}>
    {children}
  </div>
);
export const StepLabel = ({
  children,
  completed = false,
  active = false,
  className = '',
  ...props
}) => (
  <div
    className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
      active ? 'bg-blue-500 text-white' : completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
    } ${className}`}
    {...props}
  >
    {children}
  </div>
);
export const StepIcon = ({
  completed = false,
  active = false,
  icon,
  className = '',
  ...props
}) => (
  <div
    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
      active ? 'bg-blue-500 text-white' : completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
    } ${className}`}
    {...props}
  >
    {icon}
  </div>
);
export default Stepper;