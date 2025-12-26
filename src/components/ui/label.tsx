// "use client";

// import * as React from "react";
// import * as LabelPrimitive from "@radix-ui/react-label";

// import { cn } from "@/lib/utils";

// function Label({
//   className,
//   ...props
// }: React.ComponentProps<typeof LabelPrimitive.Root>) {
//   return (
//     <LabelPrimitive.Root
//       data-slot="label"
//       className={cn(
//         "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// export { Label };
"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  "data-required"?: boolean;
}

function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-required={props["data-required"]}
      className={cn(
        "flex items-center gap-1 text-sm font-medium leading-7 cursor-text mb-1 text-[#595959]",
        "after:ml-0.5 before:text-red-500 before:content-['*'] before:hidden before:font-[SimSun,sans-serif]",
        "data-[required=true]:before:inline-block",
        className
      )}
      {...props}
    />
  );
}
interface EmptyLabelProps {
  required?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function EmptyLabel({ required, className, children }: EmptyLabelProps) {
  return (
    <span
      data-required={required}
      className={cn(
        "flex items-center gap-1 text-sm font-medium leading-7 cursor-text mb-1 text-[#595959]",
        "before:ml-0.5 before:text-red-500 before:content-['*'] before:hidden before:font-[SimSun,sans-serif]",
        "data-[required=true]:before:inline-block",
        className
      )}
    >
      {children}
    </span>
  );
}

export { Label, EmptyLabel };
