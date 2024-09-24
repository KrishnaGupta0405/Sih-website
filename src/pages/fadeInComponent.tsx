import React, { useEffect, useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FadeInComponentProps {
  children: ReactNode;
}

const FadeInComponent: React.FC<FadeInComponentProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement; // Type assertion
            target.style.opacity = '1'; // Set opacity to 1
            target.style.filter = 'blur(0px)'; // Remove blur
            observer.unobserve(target); // Stop observing once visible
          }
        });
      },
      { threshold: 0.3 } // Trigger when 10% of the component is visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      style={{
        opacity: 0, // Start hidden
        filter: 'blur(10px)', // Start blurred
        transition: 'opacity 0.5s, filter 0.5s', // Smooth transition
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInComponent;
