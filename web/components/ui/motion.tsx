'use client';

import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MotionProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
};

export const slideUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

export const MotionDiv = ({ children, className, delay = 0, ...props }: MotionProps) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={slideUp}
            transition={{ delay }}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const MotionList = ({ children, className, ...props }: MotionProps) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const MotionItem = ({ children, className, ...props }: MotionProps) => {
    return (
        <motion.div
            variants={slideUp}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.div>
    );
};
