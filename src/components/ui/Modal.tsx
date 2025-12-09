import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import React, { useEffect } from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";
export type ModalPosition = "center" | "top" | "side-right" | "side-left";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
  position?: ModalPosition;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  preventClose?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm w-[90vw] sm:w-full",
  md: "max-w-md w-[90vw] sm:w-full",
  lg: "max-w-lg w-[90vw] sm:w-full",
  xl: "max-w-xl w-[90vw] sm:w-full",
  "2xl": "max-w-2xl w-[90vw] sm:w-full",
  full: "max-w-full mx-4",
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  position = "center",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  footer,
  icon,
  preventClose = false,
}) => {
  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!open && !preventClose) {
        onClose();
      }
    },
    middleware: [offset(10), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    placement:
      position === "center"
        ? "top"
        : position === "side-right"
          ? "right"
          : position === "side-left"
            ? "left"
            : "top",
  });

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !preventClose) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape, preventClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleBackdropClick = () => {
    if (closeOnBackdropClick && !preventClose) {
      onClose();
    }
  };

  const handleClose = () => {
    if (!preventClose) {
      onClose();
    }
  };

  // Animation variants based on position
  const getModalVariants = () => {
    switch (position) {
      case "side-right":
        return {
          hidden: { x: "100%", opacity: 0 },
          visible: { x: 0, opacity: 1 },
          exit: { x: "100%", opacity: 0 },
        };
      case "side-left":
        return {
          hidden: { x: "-100%", opacity: 0 },
          visible: { x: 0, opacity: 1 },
          exit: { x: "-100%", opacity: 0 },
        };
      case "top":
        return {
          hidden: { y: "-100%", opacity: 0 },
          visible: { y: 0, opacity: 1 },
          exit: { y: "-100%", opacity: 0 },
        };
      default: // center
        return {
          hidden: { scale: 0.9, opacity: 0 },
          visible: { scale: 1, opacity: 1 },
          exit: { scale: 0.9, opacity: 0 },
        };
    }
  };

  // Container classes based on position
  const getContainerClasses = () => {
    switch (position) {
      case "side-right":
        return "absolute inset-y-0 right-0 flex max-w-full z-10";
      case "side-left":
        return "absolute inset-y-0 left-0 flex max-w-full z-10";
      case "top":
        return "absolute inset-x-0 top-0 flex justify-center z-10";
      default: // center
        return "relative flex items-center justify-center min-h-screen p-2 sm:p-4 z-10";
    }
  };

  // Modal classes based on position
  const getModalClasses = () => {
    const baseClasses = "bg-white/95 backdrop-blur-lg shadow-2xl border border-white/20";

    switch (position) {
      case "side-right":
      case "side-left":
        return `${baseClasses} h-full flex flex-col w-screen ${sizeClasses[size]}`;
      case "top":
        return `${baseClasses} rounded-b-xl w-full ${sizeClasses[size]}`;
      default: // center
        return `${baseClasses} rounded-2xl w-full ${sizeClasses[size]}`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={handleBackdropClick}
          />

          {/* Modal Container */}
          <div
            className={getContainerClasses()}
            ref={refs.setReference}
            onClick={handleBackdropClick}
          >
            <motion.div
              ref={refs.setFloating}
              style={position === "center" ? {} : floatingStyles}
              variants={getModalVariants()}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className={`${getModalClasses()} ${className}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div
                  className={`flex items-center justify-between border-b border-primary-200 px-4 sm:px-6 py-3 sm:py-4 ${headerClassName}`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {icon && (
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-accent-50">
                        {icon}
                      </div>
                    )}
                    {title && (
                      <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                        {title}
                      </h2>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      onClick={handleClose}
                      disabled={preventClose}
                      className="rounded-lg p-1.5 sm:p-2 text-slate-400 transition-colors hover:bg-primary-50 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Close modal"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div
                className={`flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 ${bodyClassName}`}
              >
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div
                  className={`border-t border-primary-200 px-4 sm:px-6 py-3 sm:py-4 ${footerClassName}`}
                >
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
