import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import styles from "./styles/QuickActions.module.css";

export default function QuickActions({ actions, onNavigate }) {
    return (
        <div className={styles.grid}>
            {actions.map((item, index) => (
                <motion.div
                    key={index}
                    whileHover={{ y: -10 }}
                    whileTap={{ scale: 0.97 }}
                    className={styles.card}
                    onClick={() => onNavigate(item.route)}
                >
                    {/* Accent strip */}
                    <span className={styles.accent} />

                    <div className={styles.top}>
                        <div className={styles.iconWrap}>
                            <item.icon size={22} />
                        </div>
                        <div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                        <ArrowRight className={styles.arrow} size={18} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
