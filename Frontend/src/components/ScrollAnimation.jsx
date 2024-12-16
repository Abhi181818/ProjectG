import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

// Professional scroll reveal component
const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className = '',
  threshold = 0.2
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const mainControls = useAnimation();

  // Variant definitions with professional, subtle animations
  const variants = {
    hidden: {
      opacity: 0,
      ...(direction === 'up' && { y: 50 }),
      ...(direction === 'down' && { y: -50 }),
      ...(direction === 'left' && { x: 50 }),
      ...(direction === 'right' && { x: -50 })
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: duration,
        ease: [0.4, 0, 0.2, 1], // Elegant cubic bezier curve
        delay: delay
      }
    }
  };

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible');
    }
  }, [isInView, mainControls]);

  return (
    <div ref={ref} className={`scroll-reveal-wrapper ${className}`}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate={mainControls}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

// Scroll reveal section component for easy implementation
const ScrollRevealSection = ({
  children,
  className = '',
  scrollRevealProps = {}
}) => {
  return (
    <ScrollReveal
      {...scrollRevealProps}
      className={`py-4 ${className}`}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </ScrollReveal>
  );
};

export { ScrollReveal, ScrollRevealSection };