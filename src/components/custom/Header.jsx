import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function Header({ loginOpen }) {
  const isAuthorized = useSelector((state) => state.user.isAuthorized);
  return (
    <div>
      {/* Desktop Header */}
      <motion.header
        className="hidden md:flex w-screen items-center justify-center h-14 sticky top-5 backdrop-blur-sm z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src="/logo-light.png" alt="" className="h-50" />
      </motion.header>

      {/* Mobile Header */}
      <motion.header
        className={`md:hidden w-screen flex items-center justify-between ${isAuthorized ? "justify-center" : "justify-between"} px-4 h-14 sticky top-0 backdrop-blur-sm z-10`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {!isAuthorized ? <div className="w-8" /> : <></>}

        <img src="/logo-light.png" alt="" className="h-35 mt-3" />

        {!isAuthorized ? (
          <motion.a
            href="/auth"
            className="bg-white text-black text-sm font-semibold px-4 py-1.5 rounded-xl"
            whileTap={{ scale: 0.95 }}
          >
            Log in
          </motion.a>
        ) : (
          <></>
        )}
      </motion.header>
    </div>
  );
}
