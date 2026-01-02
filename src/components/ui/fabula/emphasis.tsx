"use client";

import * as React from "react";

import { motion, HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

function Emphasis({ className, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      data-slot="emphasis"
      className={cn(
        "absolute bottom-0 left-0 right-0 h-px bg-primary",
        className,
      )}
      {...props}
      style={{ transformOrigin: "left" }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    ></motion.div>
  );
}

export { Emphasis };
