"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/lib/tailwind-merge";

// Define the props for the custom checkbox.
// It accepts standard input attributes except for 'onChange' to avoid conflicts.
// It introduces 'onCheckedChange' to pass the new checked state (boolean) back to the parent.
type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  onCheckedChange?: (checked: boolean) => void;
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    // Handler for the native onChange event of the input element.
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // Call the onCheckedChange prop with the new boolean value.
      onCheckedChange?.(event.target.checked);
    };

    return (
      <div className="relative flex items-center justify-center w-4 h-4">
        <input
          type="checkbox"
          ref={ref}
          checked={!!checked}
          onChange={handleChange}
          className={cn(
            "appearance-none h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", // Custom styling for checked state
            className,
          )}
          // Set data attribute for CSS selectors to mimic Radix's behavior
          data-state={checked ? "checked" : "unchecked"}
          {...props}
        />
        {/* Display the checkmark icon when the checkbox is checked */}
        {checked && (
          <div className="absolute pointer-events-none">
            <Check className="h-4 w-4 text-black" />
          </div>
        )}
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
