import { useEffect, useState } from "react";

import Header from "../../components/custom/Header";
import Sidebar from "../../components/custom/Sidebar";
import MobileNav from "../../components/custom/MobileNav";
import LoginModal from "../../components/custom/LoginModal";

import NewThreadCard from "../../components/Post/newPost";

export default function ThreadsFeed({ children }) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);

  return (
    <div className="min-h-screen md:bg-[#0a0a0a] bg-[#101010] text-white flex-1 justify-center">
      {/* Sidebar */}
      <Sidebar setLoginOpen={setLoginOpen} setCardOpen={setCardOpen} />

      {/* Mobile Header */}
      <Header setLoginOpen={setLoginOpen} />

      {children}

      {/* Mobile Nav */}
      <MobileNav setLoginOpen={setLoginOpen} setCardOpen={setCardOpen} />

      {/* Bottom Padding */}
      <div className="md:hidden h-20" />

      {/* Login Modal */}
      {loginOpen ? <LoginModal setLoginOpen={setLoginOpen} /> : <></>}

      {/* Post Card */}
      {cardOpen ? <NewThreadCard setCardOpen={setCardOpen} /> : <></>}
    </div>
  );
}
