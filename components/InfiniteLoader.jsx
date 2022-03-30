import { motion } from 'framer-motion';

export default function InfiniteLoader({ handleEnter = () => {} }) {
  return (
    <motion.div
      className="w-full text-center py-4"
      onViewportEnter={handleEnter}>
      <i className="fas fa-spinner-third text-xl animate-spin" />
    </motion.div>
  );
}
