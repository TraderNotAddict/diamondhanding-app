import * as React from 'react';
import { motion } from 'framer-motion';

export const SolanaLogo = () => (
  <motion.div exit={{ opacity: 0 }} animate={{ opacity: 1 }} initial={false}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="2 5 18 20"
      className="glow-logo"
    >
      <path
        fillRule="evenodd"
        d="M7.084 5.223A.5.5 0 0 1 7.5 5h11a.5.5 0 0 1 .416.777l-2 3A.5.5 0 0 1 16.5 9h-11a.5.5 0 0 1-.416-.777l2-3ZM7.768 6 6.434 8h9.798l1.334-2H7.768ZM7.084 15.223A.5.5 0 0 1 7.5 15h11a.5.5 0 0 1 .416.777l-2 3A.5.5 0 0 1 16.5 19h-11a.5.5 0 0 1-.416-.777l2-3Zm.684.777-1.334 2h9.798l1.334-2H7.768ZM7.084 13.777A.5.5 0 0 0 7.5 14h11a.5.5 0 0 0 .416-.777l-2-3A.5.5 0 0 0 16.5 10h-11a.5.5 0 0 0-.416.777l2 3ZM7.768 13l-1.334-2h9.798l1.334 2H7.768Z"
        clipRule="evenodd"
      />
    </svg>
  </motion.div>
);
