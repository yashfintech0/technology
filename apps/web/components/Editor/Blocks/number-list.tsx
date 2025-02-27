import { cn } from "@/lib/utils";
import React from "react";

const NumberList = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn("my-6 ml-6 list-decimal  [&>li]:mt-2", className)}
    {...props}
  />
));

export default NumberList;
