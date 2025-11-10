// Replacement for @mui/material Box
export const Box = ({ children, sx = {}, className = '', ...props }) => {
  const inlineStyles = {};
  
  // Convert MUI sx props to inline styles
  if (sx.display) inlineStyles.display = sx.display;
  if (sx.flexDirection) inlineStyles.flexDirection = sx.flexDirection;
  if (sx.justifyContent) inlineStyles.justifyContent = sx.justifyContent;
  if (sx.alignItems) inlineStyles.alignItems = sx.alignItems;
  if (sx.gap) inlineStyles.gap = sx.gap;
  if (sx.p) inlineStyles.padding = sx.p;
  if (sx.padding) inlineStyles.padding = sx.padding;
  if (sx.m) inlineStyles.margin = sx.m;
  if (sx.margin) inlineStyles.margin = sx.margin;
  if (sx.mt) inlineStyles.marginTop = sx.mt;
  if (sx.mb) inlineStyles.marginBottom = sx.mb;
  if (sx.ml) inlineStyles.marginLeft = sx.ml;
  if (sx.mr) inlineStyles.marginRight = sx.mr;
  if (sx.width) inlineStyles.width = sx.width;
  if (sx.height) inlineStyles.height = sx.height;
  if (sx.backgroundColor) inlineStyles.backgroundColor = sx.backgroundColor;
  if (sx.color) inlineStyles.color = sx.color;
  if (sx.border) inlineStyles.border = sx.border;
  if (sx.borderRadius) inlineStyles.borderRadius = sx.borderRadius;
  if (sx.overflow) inlineStyles.overflow = sx.overflow;
  if (sx.maxHeight) inlineStyles.maxHeight = sx.maxHeight;
  if (sx.minHeight) inlineStyles.minHeight = sx.minHeight;
  if (sx.maxWidth) inlineStyles.maxWidth = sx.maxWidth;
  if (sx.textAlign) inlineStyles.textAlign = sx.textAlign;
  
  // Merge all remaining sx properties
  Object.assign(inlineStyles, sx);
  
  return (
    <div className={className} style={inlineStyles} {...props}>
      {children}
    </div>
  );
};

export default Box;
