import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import ChevronDownIcon from "../icons/chevrondown";
import { Chevron } from "react-day-picker";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

interface ExclusiveButtonProps {
  Text: string;
  className?: string;
}

const ExclusiveButton = ({ Text, className }: ExclusiveButtonProps) => {
  return (
    <button className={className}>
      {Text}
    </button>
  )
};

interface DropMenuButtonProps {
  Buttontext: string;
}

const DropMenuButton = ({Buttontext}: DropMenuButtonProps) => {  
  return (
    <div className="flex rounded-sm border px-2 py-1 gap-1 bg-[#f0f2f5] text-[#121417] cursor-pointer">
      <button>
        {Buttontext}
      </button>
      <ChevronDownIcon/>
    </div>
  )
}

interface TransparentButtonProps {
  Buttontext: string;
  icon: React.ReactElement;
  ChevronIcon?: React.ReactElement;
  className?: string;
}

const TransparentButton = ({Buttontext, icon, ChevronIcon, className}: TransparentButtonProps) => {  
  return (
    <div className={`flex px-2 py-1 gap-1 text-[#70707a] cursor-pointer ${className}`}>
      <button className="flex gap-1">
        {icon}
        {Buttontext}
      </button>
      {ChevronIcon}
    </div>
  )
}

interface XnoxButtonProps {
  Text: string;
}

const XnoxButton = ({Text}: XnoxButtonProps) => {
  return (
    <button className="bg-[#F0F2F5] text-[#121417] px-4 py-1 rounded-md">
      {Text}
    </button>
  )
}

export { Button, buttonVariants, ExclusiveButton, DropMenuButton, TransparentButton, XnoxButton };
