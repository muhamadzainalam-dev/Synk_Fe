import { motion } from "framer-motion";

const ActionBtn = ({ icon, count, onClick, active }) => (
  <motion.button
    className={`flex items-center gap-1.5 ${active ? "text-red-500" : "text-gray-400"} hover:text-white transition-colors`}
    whileTap={{ scale: 0.85 }}
    whileHover={{ scale: 1.1 }}
    onClick={onClick}
  >
    {icon}
    {count !== undefined && (
      <span className="text-sm text-gray-400">{count}</span>
    )}
  </motion.button>
);

export default ActionBtn;
