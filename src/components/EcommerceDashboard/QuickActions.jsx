import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import styles from "./styles/QuickActions.module.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../store/context";
import AuthModal from "../AuthModal/AuthModal";
import { useNavigate, useParams } from "react-router-dom";

export default function QuickActions({ actions, onNavigate }) {
    const { user: authUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const { domain: urlDomain } = useParams();
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Extract domain from URL
    const getDomain = () => {
        // First, try to get from URL params
        if (urlDomain) {
            return urlDomain;
        }

        // If not in params, try to extract from pathname
        const pathname = window.location.pathname;
        const pathParts = pathname.split('/').filter(p => p);
        
        // Check if first part looks like a domain (contains a dot)
        if (pathParts.length > 0 && pathParts[0].includes('.')) {
            return pathParts[0];
        }

        // Default to indiabills
        return "indiabills";
    };

    const handleActionClick = (route) => {
        if (!authUser) {
            setShowAuthModal(true);
        } else {
            // If authenticated, navigate to the route
            onNavigate(route);
        }
    };

    return (
        <>
            {/* Auth Modal */}
            <AuthModal 
                isOpen={showAuthModal} 
                onClose={() => setShowAuthModal(false)} 
                domain={getDomain()}
            />

            <div className={styles.grid}>
            {actions.map((item, index) => (
                <motion.div
                    key={index}
                    whileHover={{ y: -10 }}
                    whileTap={{ scale: 0.97 }}
                    className={styles.card}
                    onClick={() => handleActionClick(item.route)}
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
        </>
    );
}
