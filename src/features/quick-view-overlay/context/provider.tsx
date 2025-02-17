import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { QuickViewContext } from "./context";

export const QuickViewProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  const openQuickView = (newContent: ReactNode) => {
    setContent(newContent);
    setIsOpen(true);
  };

  const closeQuickView = () => {
    setIsOpen(false);
    setTimeout(() => setContent(null), 300);
  };

  return (
    <QuickViewContext.Provider value={{ openQuickView, closeQuickView }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-foreground/80 dark:bg-foreground/20 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
          >
            <motion.div
              className="bg-background p-6 rounded-lg shadow-lg relative w-[85%] h-[90%]"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                duration: 0.15,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </QuickViewContext.Provider>
  );
};
