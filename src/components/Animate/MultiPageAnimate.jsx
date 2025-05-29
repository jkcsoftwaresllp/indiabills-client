import { motion } from 'framer-motion';
import React from "react";

const MultiPageAnimate = ({ children}) => {
    return (
        <motion.div
            className='min-w-full flex flex-col'
            initial={{ x: 200 }}
            animate={{ x: 0 }}
            exit={{ opacity: 0 }}
            transition={{
                type: "spring",
                duration: 0.5,
            }}>
            {children}
        </motion.div>
    );
};

export default MultiPageAnimate;