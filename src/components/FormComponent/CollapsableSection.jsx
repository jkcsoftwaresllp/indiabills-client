import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {AnimatePresence, motion} from "framer-motion";
import React, {useState} from "react";
import styles from './styles/CollapsableSection.module.css';

export const CollapsableSection = ({ title, children }) => {

    const [isOptionalOpen, setIsOptionalOpen] = useState(false);

    const toggleOptional = () => {
        setIsOptionalOpen((prev) => !prev);
    };

   return (
  <div className={styles.wrapper}>
    <button onClick={toggleOptional} className={styles.toggleButton}>
      <span className={styles.title}>{title}</span>
      {isOptionalOpen ? (
        <ExpandMoreIcon className={styles.icon} />
      ) : (
        <ExpandLessIcon className={styles.icon} />
      )}
    </button>

    <AnimatePresence initial={false}>
      {isOptionalOpen && (
        <motion.div
          key="optional"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { height: 'auto', opacity: 1 },
            collapsed: { height: 0, opacity: 0 },
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={styles.content}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
}