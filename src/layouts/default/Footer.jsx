import { useState } from "react";
import { motion } from "framer-motion";
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import SettingsIcon from '@mui/icons-material/Settings';
import styles from './styles/Footer.module.css';

const Footer = () => {

	const [popDown, setPopDown] = useState(true);

	return (
  <motion.div
    initial={{ translateY: '100px' }}
    animate={{ translateY: popDown ? '0px' : '100px' }}
    transition={{ duration: 1, type: 'spring' }}
    className={styles.container}
  >
    <div className={styles.inputWrapper}>
      <div className={styles.iconBox}>
        <ContactSupportIcon />
      </div>
      <input
        className={styles.input}
        placeholder="Smart Chat"
        type="text"
      />
    </div>
    <SettingsIcon />
  </motion.div>
);
}

export default Footer;
