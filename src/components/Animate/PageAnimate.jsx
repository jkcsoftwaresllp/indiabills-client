import { motion } from "framer-motion";
import { useStore } from "zustand";

const PageAnimate = ({ children, nostyle }) => {
  const animationSettings = JSON.parse(
    localStorage.getItem("animationsEnabled") || "true",
  );

  // const {} = useStore();

  const giveClass =
    // "w-full min-h-full p-4 flex bg-light text-dark rounded-xl flex-col gap-8";
    "w-full min-h-full flex bg-light text-dark flex-col gap-8";

  if (animationSettings === false) {
    return <div className={`${nostyle ? "" : giveClass}`}>{children}</div>;
  } else {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{
          type: "tween",
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={`${nostyle ? "" : giveClass}`}
      >
        {children}
      </motion.div>
    );
  }
};

export default PageAnimate;
