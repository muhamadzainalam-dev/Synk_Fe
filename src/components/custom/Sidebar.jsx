import { motion } from "framer-motion";
import {
  House,
  Search,
  Plus,
  Heart,
  UserRound,
  CircleFadingPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ setLoginOpen, setCardOpen }) => {
  const user = useSelector((state) => state.user.value);
  const [user_Name, setUser_Name] = useState("");
  const isAuthorized = useSelector((state) => state.user.isAuthorized);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      setUser_Name(user.user_Name);
    }
  }, [user]);

  const NAV_ITEMS = [
    { icon: House, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Plus, label: "New", action: "new" },
    { icon: Heart, label: "Activity", path: "/activity" },
    { icon: UserRound, label: "Profile", path: `/user/${user_Name}` },
  ];

  const handleClick = (item) => {
    if (!isAuthorized) {
      setLoginOpen(true);
      return;
    }

    navigate(item.path);

    if (item.action === "new") {
      setCardOpen(true);
    }
  };

  return (
    <motion.aside
      className="hidden md:flex flex-col items-center justify-center gap-8 w-16 lg:w-20 fixed left-0 top-0 bottom-0 py-6 z-20"
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {NAV_ITEMS.map((item, i) => {
        const Icon = item.icon;
        const isActive = item.path && location.pathname === item.path;

        return (
          <motion.button
            key={item.label}
            onClick={() => handleClick(item)}
            title={item.label}
            className={`p-2 rounded-xl transition-colors ${
              isActive
                ? "text-white bg-[#1e1e1e]"
                : "text-gray-500 hover:text-white hover:bg-[#1e1e1e]"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
          >
            <Icon />
          </motion.button>
        );
      })}
    </motion.aside>
  );
};

export default Sidebar;
