import {motion} from 'framer-motion';

const FormAnimate = ({ children, className}) => {

    const itemVariants = {
        hidden: {opacity: 0, x: 20},
        visible: {opacity: 1, x: 0},
        exit: {opacity: 0, x: -20}
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={itemVariants}
            className={className}
        >
            {children}
        </motion.div>

    )
}

export default FormAnimate;