import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { House, Search, Plus, Heart, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

export default function MobileNav({ setLoginOpen, setCardOpen }) {
  const user = useSelector((state) => state.user.value);
  const [user_Name, setUser_Name] = useState("");

  useEffect(() => {
    if (user) {
      setUser_Name(user.user_Name);
    }
  }, [user]);

  const icons = [
    { icon: House, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Plus, label: "New", action: "new" },
    { icon: Heart, label: "Activity", path: "/activity" },
    { icon: UserRound, label: "Profile", path: `/user/${user_Name}` },
  ];

  const isAuthorized = useSelector((state) => state.user.isAuthorized);
  const navigate = useNavigate();

  const handleclick = (item) => {
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
    <motion.nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-[#101010] border-gray-800 border-t flex items-center justify-center gap-6.5 py-1 z-20"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {icons.map((item) => {
        const Icon = item.icon;

        return (
          <motion.button
            key={item.label}
            className={`p-2 text-gray-500 ${item.label === "New" ? "-mx-2" : ""}`}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => handleclick(item)}
          >
            {item.label === "New" ? (
              <div className="bg-[#343536] px-6 rounded-xl p-3 flex items-center justify-center">
                <Plus className="text-white" size={20} />
              </div>
            ) : (
              <Icon />
            )}
          </motion.button>
        );
      })}
    </motion.nav>
  );
}
