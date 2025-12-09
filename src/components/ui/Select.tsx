import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  useListNavigation,
  useTypeahead,
  FloatingPortal,
} from "@floating-ui/react";
import type { SelectProps } from "@components/types/select-types";

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      onValueChange,
      onChange,
      placeholder = "Select...",
      disabled = false,
      className,
      name,
      id,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
    const listRef = React.useRef<(HTMLButtonElement | null)[]>([]);
    const labelsRef = React.useRef<string[]>([]);

    const selectedOption = options.find((option) => option.value === value);
    const handleChange = onValueChange || onChange;

    // Update labels ref when options change
    React.useEffect(() => {
      labelsRef.current = options.map((option) => option.display_name);
    }, [options]);

    // Floating UI setup
    const { refs, floatingStyles, context } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      strategy: "fixed",
      middleware: [
        offset(8),
        flip({ padding: 8 }),
        shift({ padding: 8 }),
        size({
          apply({ rects, elements }) {
            Object.assign(elements.floating.style, {
              minWidth: `${rects.reference.width}px`,
              maxWidth: `${Math.max(rects.reference.width, 320)}px`,
            });
          },
          padding: 8,
        }),
      ],
      whileElementsMounted: autoUpdate,
      placement: "bottom-start",
    });

    // Interaction hooks
    const click = useClick(context, { enabled: !disabled });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "listbox" });
    const listNavigation = useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
      loop: true,
    });
    const typeahead = useTypeahead(context, {
      listRef: labelsRef,
      activeIndex,
      onMatch: setActiveIndex,
      enabled: isOpen,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } =
      useInteractions([click, dismiss, role, listNavigation, typeahead]);

    const handleSelect = (optionValue: string) => {
      handleChange?.(optionValue);
      setIsOpen(false);
      setActiveIndex(null);
    };

    // Merge refs for the button
    const mergeRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        refs.setReference(node);
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, refs]
    );

    // Handle keyboard selection
    React.useEffect(() => {
      if (isOpen && activeIndex !== null) {
        listRef.current[activeIndex]?.scrollIntoView({
          block: "nearest",
        });
      }
    }, [isOpen, activeIndex]);

    return (
      <>
        <button
          ref={mergeRefs}
          type="button"
          disabled={disabled}
          name={name}
          id={id}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          {...getReferenceProps()}
          className={cn(
            "flex h-auto w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors duration-200 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            isOpen
              ? "!border-gray-300 !ring-0"
              : "focus-visible:border-transparent focus-visible:ring-2",
            className
          )}
        >
          <span className={cn(!selectedOption && "text-gray-400")}>
            {selectedOption?.display_name || placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-500 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence>
          {isOpen && !disabled && (
            <FloatingPortal>
              <FloatingFocusManager context={context} modal={false}>
                <motion.div
                  ref={refs.setFloating}
                  style={floatingStyles}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="z-[70] rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none focus-visible:outline-none"
                  {...getFloatingProps()}
                >
                  <div className="max-h-60 overflow-auto p-1">
                    {options.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        No options available
                      </div>
                    ) : (
                      options.map((option, index) => (
                        <button
                          key={option.value}
                          ref={(node) => {
                            listRef.current[index] = node;
                          }}
                          type="button"
                          role="option"
                          aria-selected={value === option.value}
                          tabIndex={activeIndex === index ? 0 : -1}
                          onClick={() => handleSelect(option.value)}
                          {...getItemProps({
                            onClick: () => handleSelect(option.value),
                          })}
                          className={cn(
                            "flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-sm text-gray-900 transition-colors duration-100 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none",
                            value === option.value &&
                              "bg-blue-100 font-medium text-blue-700",
                            activeIndex === index && "bg-blue-50 text-blue-700"
                          )}
                        >
                          <span className="mr-2 flex h-4 w-4 items-center justify-center">
                            {value === option.value && (
                              <Check className="h-4 w-4" />
                            )}
                          </span>
                          {option.display_name}
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              </FloatingFocusManager>
            </FloatingPortal>
          )}
        </AnimatePresence>
      </>
    );
  }
);

Select.displayName = "Select";
