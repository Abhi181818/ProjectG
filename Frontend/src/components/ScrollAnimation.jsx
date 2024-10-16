import React from 'react';
import { motion } from 'framer-motion';

const ScrollAnimation = ({ children, threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  const handleScroll = () => {
    const { current } = ref;
    if (current) {
      const rect = current.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight * threshold;
      setIsVisible(isInView);
    }
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;
