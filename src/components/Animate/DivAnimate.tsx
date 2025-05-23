// DivAnimate.tsx

import React from "react";
import { motion } from 'framer-motion';
import { Box, SxProps } from '@mui/material';

interface Props {
  children: React.ReactNode;
  className?: string;
  sx?: SxProps;
}

const DivAnimate: React.FC<Props> = ({ children, className, sx }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={itemVariants}
      className={className}
      sx={sx}
    >
      {children}
    </Box>
  );
};

export default DivAnimate;