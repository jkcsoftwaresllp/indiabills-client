import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {AnimatePresence, motion} from "framer-motion";
import React, {useState} from "react";

export const CollapsableSection = ({ title, children }) => {

    const [isOptionalOpen, setIsOptionalOpen] = useState<boolean>(false);

    const toggleOptional = () => {
        setIsOptionalOpen((prev) => !prev);
    };

    return (
        <div className="w-full mt-4 flex flex-col gap-2">
            <button onClick={toggleOptional}
                    className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg ">
                <span className="font-semibold">{title}</span>
                {isOptionalOpen ? (
                    <ExpandMoreIcon className="text-gray-600"/>
                ) : (
                    <ExpandLessIcon className="text-gray-600"/>
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
                            open: {height: "auto", opacity: 1},
                            collapsed: {height: 0, opacity: 0},
                        }}
                        transition={{duration: 0.3, ease: "easeInOut"}}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}