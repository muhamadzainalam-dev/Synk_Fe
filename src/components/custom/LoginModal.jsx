import { motion } from "framer-motion";
import { TiUserAddOutline } from "react-icons/ti";

const LoginModal = ({ setLoginOpen }) => {
  return (
    <div
      className="fixed top-0 h-[100vh] w-[100vw] backdrop-blur-sm z-20 flex items-center justify-center"
      onClick={() => {
        setLoginOpen(false);
      }}
    >
      <motion.div
        className="w-72 bg-[#181818] border border-gray-700 rounded-2xl p-5 px-6 z-30"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <h2 className="text-white font-bold text-xl mb-2">Log in or sign up</h2>
        <p className="text-gray-400 text-sm mb-5">
          Find your kind and join conversations that matter to you.
        </p>
        <a href="/auth">
          <motion.button
            className="w-full flex items-center justify-center gap-2 bg-[#242424] hover:bg-[#2e2e2e] text-white py-3 px-4 rounded-xl transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <TiUserAddOutline className="text-xl my-auto" />
            <p className="text-sm font-semibold">Continue To Auth Page</p>
          </motion.button>
        </a>
      </motion.div>
    </div>
  );
};

export default LoginModal;
