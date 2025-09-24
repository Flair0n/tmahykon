import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypingAnimation = ({ text, speed = 100, delay = 0, className }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, delay + currentIndex * speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, delay]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className={className}
    >
      {displayedText}
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        style={{
          color: '#A74EA7',
          fontWeight: 'bold',
          marginLeft: '2px'
        }}
      >
        |
      </motion.span>
    </motion.div>
  );
};

export default TypingAnimation;
