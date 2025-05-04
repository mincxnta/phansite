import React from 'react';
import { motion } from 'framer-motion';
import joker from '../assets/loading/joker.png';
import text from '../assets/loading/text.png';
import '../assets/Loading.css';

export const Loading = () => {
  return (
    <div className="loading-container">
      <motion.div
        className="flip-container joker"
        animate={{ rotateY: 360 }}
        transition={{
          rotateY: {
            repeat: Infinity,
            duration: 1,
            ease: 'linear',
            repeatDelay: 1,
          },
        }}
      >
        <motion.div className="flip-face">
          <img src={joker} alt="Loading Joker" />
        </motion.div>
        <motion.div className="flip-face flip-back">
          <img src={joker} alt="Loading Joker" />
        </motion.div>
      </motion.div>

      <motion.div
        className="flip-container text"
        animate={{ rotateY: 360 }}
        transition={{
          rotateY: {
            repeat: Infinity,
            duration: 1,
            ease: 'linear',
            delay: 0.25,
            repeatDelay: 1,
          },
        }}
      >
        <motion.div className="flip-face">
          <img src={text} alt="Loading Text" />
        </motion.div>
        <motion.div className="flip-face flip-back">
          <img src={text} alt="Loading Text" />
        </motion.div>
      </motion.div>
    </div>
  );
};