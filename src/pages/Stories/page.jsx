import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Send } from "lucide-react";

const stories = [
  {
    id: 1,
    username: "callme__.nehal",
    time: "1 h",
    caption:
      "Once i heared:\ntootey huve dil dostoon k paas\njaatey hein, magar jo dil\ndostoon se toot jaaye wo phir\nkahaan jaaye?",
    media_path: "/story_media_one.jpg",
  },
  {
    id: 2,
    username: "jibrail_bin_adnan",
    time: "1 h",
    caption: "Iran or Israel ki jang me stand lena",
    media_path: "/story_media_two.jpg",
  },
];

const SideStory = ({ story, onClick, side }) => {
  const isRight = side === "right";

  return (
    <motion.div
      className="hidden lg:flex absolute top-1/2 -translate-y-1/2 cursor-pointer"
      style={{ [isRight ? "right" : "left"]: "-180px" }}
      initial={{ opacity: 0, x: isRight ? 40 : -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
    >
      <div className="w-36 h-64 rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl">
        <div className={`w-full h-full bg-gradient-to-b ${story.bg}`} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white text-xs font-semibold truncate">
            {story.username}
          </p>
          <p className="text-white/60 text-[10px]">{story.time}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function InstagramStoryViewer() {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [visible, setVisible] = useState(true);

  const story = stories[index];
  const hasPrev = index > 0;
  const hasNext = index < stories.length - 1;

  const goNext = useCallback(() => {
    if (hasNext) setIndex((i) => i + 1);
    else setVisible(false);
  }, [hasNext]);

  const goPrev = useCallback(() => {
    if (hasPrev) setIndex((i) => i - 1);
  }, [hasPrev]);

  const handleDoubleTap = () => {
    setLiked(true);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  if (!visible) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white text-center"
        >
          <p className="text-2xl font-bold mb-3">Stories ended</p>
          <button
            onClick={() => {
              setVisible(true);
              setIndex(0);
            }}
            className="px-6 py-2 bg-white text-black rounded-xl font-semibold text-sm"
          >
            Watch again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative flex items-center justify-center">
        {hasPrev && (
          <SideStory story={stories[index - 1]} onClick={goPrev} side="left" />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={story.id}
            className="relative w-[340px] sm:w-[380px] h-[680px] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            initial={{ opacity: 0, scale: 0.96, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.96, x: -40 }}
            transition={{ duration: 0.35 }}
            onDoubleClick={handleDoubleTap}
          >
            <div className="absolute inset-0 bg-gradient-to-b">
              <img
                src={story.media_path}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            <div className="relative z-10 flex items-center gap-2 px-3 pt-3">
              <img
                src="/userPlaceholderImage.png"
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white font-semibold text-sm">
                {story.username}
              </span>
            </div>

            <AnimatePresence>
              {showHeart && (
                <motion.div
                  className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.2 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.4 }}
                >
                  <Heart
                    size={80}
                    className="text-white fill-white drop-shadow-2xl"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute inset-0 z-10 flex">
              <div className="w-1/3 cursor-pointer" onClick={goPrev} />
              <div className="w-1/3" />
              <div className="w-1/3 cursor-pointer" onClick={goNext} />
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-4 pt-2 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2.5 h-10 flex items-center overflow-hidden">
                  <p className="text-white text-sm whitespace-nowrap overflow-x-auto scrollbar-hide">
                    {story.caption}
                  </p>
                </div>
                <motion.button
                  onClick={() => setLiked((l) => !l)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  className="text-white p-1"
                >
                  <Heart
                    size={28}
                    className={`transition-colors ${liked ? "fill-red-500 text-red-500" : "text-white"}`}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {hasNext && (
          <SideStory story={stories[index + 1]} onClick={goNext} side="right" />
        )}

        {hasPrev && (
          <motion.button
            className="absolute left-4 lg:-left-52 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/10"
            onClick={goPrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={20} />
          </motion.button>
        )}

        {hasNext && (
          <motion.button
            className="absolute right-4 lg:-right-52 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/10"
            onClick={goNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={20} />
          </motion.button>
        )}
      </div>
    </div>
  );
}
