// src/utils/animations.js

// 1. Smooth Page Transitions Setup
export const pageTransitionVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } 
  },
  exit: { 
    opacity: 0, 
    y: -15,
    transition: { duration: 0.3, ease: "easeIn" } 
  }
};

// 2. Premium Cinematic Hero Text & Backdrop Fades
export const heroFadeVariants = {
  initial: { opacity: 0, scale: 1.03 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" }
  }
};

export const staggerContainerVariants = {
  animate: {
    transition: { staggerChildren: 0.05 }
  }
};

export const heroTextVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
  }
};

// 3. Luxurious Card Hover Lift (Scale + Subtle Y Offset)
export const cardHoverVariants = {
  initial: { y: 0, scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
  hover: { 
    y: -6, 
    scale: 1.02,
    boxShadow: "0 20px 25px -5px rgba(245, 158, 11, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.4)",
    transition: { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }
  },
  tap: { scale: 0.98 }
};

// 4. Subtle Micro-Interactions for Action Triggers
export const microInteractionVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeInOut" } },
  tap: { scale: 0.95 }
};