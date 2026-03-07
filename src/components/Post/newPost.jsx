import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

export default function NewThreadCard({ setCardOpen }) {
  const user = useSelector((state) => state.user.value);
  const [posted, setPosted] = useState(false);
  const textRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      text: "",
      image: null,
    },
  });

  const text = watch("text");

  const onSubmit = async (data) => {
    const file = data.image?.[0];
    const filename = `${user.user_Name}-${Date.now()}.jpg`;

    try {
      if (file) {
        // Payload
        const payload = {
          filename: filename,
          contentType: file.type,
        };

        // Get Response
        const uploadUrlResponse = await axios.post(
          `${SERVER_URI}/getuploadingurl`,
          payload,
          {
            withCredentials: true,
          },
        );

        // Uploading URL
        const uploadingURL = uploadUrlResponse.data;

        // Put File To The URL
        await axios.put(uploadingURL, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
      }

      const postPayloadOne = {
        user_Name: user.user_Name,
        content: text,
        mediaKey: filename,
      };

      const postPayloadTwo = {
        user_Name: user.user_Name,
        content: text,
      };

      // Save To DB
      await axios.post(
        `${SERVER_URI}/newpost`,
        file ? postPayloadOne : postPayloadTwo,
        {
          withCredentials: true,
        },
      );

      setPosted(true);
      reset();

      setTimeout(() => {
        setPosted(false);
      }, 1000);

      setCardOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const canPost = text?.trim().length > 0;

  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] md:backdrop-blur-sm bg-[#1a1a1a] md:bg-transparent z-20 flex md:items-center justify-center p-4">
      <motion.div
        className="w-full md:max-w-lg bg-[#1a1a1a] rounded-3xl overflow-hidden md:border border-[#2a2a2a]"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <motion.div
          className="flex items-center justify-between px-5 py-4 md:border-b border-[#2a2a2a]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <motion.button
            className="text-white text-sm font-medium hover:text-gray-300 transition-colors"
            whileTap={{ scale: 0.95 }}
            onClick={() => setCardOpen(false)}
          >
            Cancel
          </motion.button>

          <span className="text-white font-bold text-base">New Post</span>

          <div className="w-8"></div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Body */}
          <div className="px-5 pt-4 pb-2">
            <motion.div
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.22,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <img
                  src="/userPlaceholderImage.png"
                  alt=""
                  className="w-10 rounded-full"
                />
              </div>

              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center flex-wrap mb-1">
                  <span className="text-white font-semibold text-sm">
                    {user.user_Name}
                  </span>
                </div>

                <textarea
                  ref={textRef}
                  {...register("text")}
                  placeholder="What's new?"
                  rows={3}
                  className="w-full bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none resize-none leading-relaxed no-scrollbar"
                />

                <div className="mt-3">
                  {/* <label className="text-gray-400 text-xs cursor-pointer hover:text-gray-300"> */}
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    className="hidden"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            className="flex items-center justify-between px-5 py-4 border-t border-[#2a2a2a] mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.48,
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="w-8"></div>

            <motion.button
              type="submit"
              disabled={!canPost || isSubmitting || posted}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all border ${
                canPost && !isSubmitting && !posted
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-gray-600 border-gray-700 cursor-not-allowed"
              }`}
              whileHover={canPost && !isSubmitting ? { scale: 1.05 } : {}}
              whileTap={canPost && !isSubmitting ? { scale: 0.95 } : {}}
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.span
                    key="posting"
                    className="flex items-center gap-1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Loader2 size={14} className="animate-spin" /> Posting
                  </motion.span>
                ) : posted ? (
                  <motion.span
                    key="posted"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-1"
                  >
                    <Check className="h-5 w-5" /> Posted
                  </motion.span>
                ) : (
                  <motion.span
                    key="post"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Post
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
