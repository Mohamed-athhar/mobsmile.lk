import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LogoMark } from "./Logo";

export function LoadingScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("mobsmile-intro") === "seen") {
      setDone(true);
      return;
    }
    const t = setTimeout(() => {
      sessionStorage.setItem("mobsmile-intro", "seen");
      setDone(true);
    }, 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-3xl" />
            <LogoMark className="relative h-24 w-24" />
          </motion.div>
          <motion.p
            className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            mobsmile
          </motion.p>
          <motion.div
            className="mt-6 h-[2px] w-40 overflow-hidden rounded-full bg-primary/15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full w-full bg-primary"
              initial={{ scaleX: 0, transformOrigin: "left" }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.1, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
