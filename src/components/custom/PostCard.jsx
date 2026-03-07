import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Heart, X } from "lucide-react";
import ActionBtn from "./ActionBtn";
import { getMedia } from "../../services/getMedia";
import { useSelector } from "react-redux";
import axios from "axios";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const PostCard = ({ post, index, size = "md" }) => {
  const user = useSelector((state) => state.user.value);
  const [user_Name, setUser_Name] = useState("");
  const [media, setMedia] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like.length);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setUser_Name(user.user_Name);
    }
  }, [user]);

  const filename = post.mediaKey;

  useEffect(() => {
    getMedia(filename).then((e) => setMedia(e.data));
  }, []);

  const handleLike = async () => {
    setLiked((p) => !p);
    setLikeCount((c) => (liked ? c - 1 : c + 1));

    const payload = {
      id: post._id,
      username: user_Name,
    };

    await axios.post(`${SERVER_URI}/like`, payload, {
      withCredentials: true,
    });
  };

  useEffect(() => {
    if (!user) return;

    if (post.like.includes(user_Name)) {
      setLiked(true);
    }
  }, [user, post]);

  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";

  return (
    <motion.div
      className="px-4 py-4 sm:px-6 border-gray-700 border-b"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <img
            src="/userPlaceholderImage.png"
            className={`${sizeClass} rounded-full flex items-center justify-center object-cover`}
          />
          <div className="flex items-center justify-between gap-1.5 flex-wrap font-semibold text-white text-sm sm:text-base">
            {post.user_Name}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="-mt-3 ml-[52px]">
        <p className="text-white text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        {/* Media Section */}
        {filename && (
          <div className="mt-3 rounded-lg overflow-hidden bg-gray-900">
            <div className="relative group">
              <img
                src={media}
                alt="Post media"
                className="w-full h-auto max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => setLightboxOpen(true)}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-8 mt-3 text-gray-500 text-sm">
          <ActionBtn
            icon={
              <motion.span
                key={liked ? "liked" : "unliked"}
                initial={{ scale: 0.8 }}
                animate={{ scale: liked ? 1.3 : 1.1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                }}
              >
                <Heart
                  size={16}
                  fill={liked ? "currentColor" : "none"}
                  stroke="currentColor"
                />
              </motion.span>
            }
            count={likeCount || 0}
            onClick={handleLike}
            active={liked}
          />
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <motion.div
          className="fixed top-0 inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={media}
              alt="Post media fullscreen"
              className="w-full h-auto max-h-[90vh] object-contain"
            />

            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all hover:scale-110"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PostCard;
