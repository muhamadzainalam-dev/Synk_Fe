import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const fieldVariant = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, x: 12, transition: { duration: 0.2 } },
};

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [iserror, setIsError] = useState(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsError(null);

    try {
      const endpoint = isSignup ? "/signup" : "/login";

      const payload = isSignup
        ? {
            name: data.name,
            email: data.identifier,
            password: data.password,
          }
        : {
            email: data.identifier,
            password: data.password,
          };

      const response = await axios.post(`${SERVER_URI}${endpoint}`, payload, {
        withCredentials: true,
      });

      console.log("Server Response:", response.data);

      //  SUCCESS FLOW
      setIsError(response.data.message);
      navigate("/otpverify");
    } catch (error) {
      console.error("Auth Error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      setIsError(message);
    }
  };

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101010] background">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm px-4 sm:px-0 mx-auto"
      >
        {/* Text */}
        <motion.h2 className="text-white text-center text-3xl font-semibold mb-6">
          {isSignup ? "Signup" : "Login"}
        </motion.h2>

        {/* Name (Signup only) */}
        <AnimatePresence>
          {isSignup && (
            <motion.div
              key="name-field"
              variants={fieldVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <input
                type="text"
                placeholder="Full name"
                {...register("name", { required: "Name is required" })}
                className="w-full mb-3 px-6 py-4 rounded-2xl bg-[#1e1e1e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mb-2">
                  {errors.name.message}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="visible"
        >
          <input
            type="text"
            placeholder="Email address"
            {...register("identifier", { required: "This field is required" })}
            className="w-full mb-3 px-6 py-4 rounded-2xl bg-[#1e1e1e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          {errors.identifier && (
            <p className="text-red-500 text-xs mb-2">
              {errors.identifier.message}
            </p>
          )}
        </motion.div>

        {/* Password */}
        <motion.div
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="visible"
        >
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            className="w-full mb-3 px-6 py-4 rounded-2xl bg-[#1e1e1e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mb-3">
              {errors.password.message}
            </p>
          )}
        </motion.div>

        {iserror && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          >
            {iserror}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-black font-semibol4 py-4 rounded-2xl disabled:opacity-60"
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="visible"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {isSubmitting
            ? isSignup
              ? "Creating account..."
              : "Logging in..."
            : isSignup
              ? "Sign up"
              : "Log in"}
        </motion.button>

        {/* Divider */}
        <motion.div
          className="flex items-center my-6 text-gray-500 text-sm"
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="visible"
        >
          <div className="flex-1 h-px bg-gray-700" />
          <span className="px-3">or</span>
          <div className="flex-1 h-px bg-gray-700" />
        </motion.div>

        {/* Google */}
        <motion.button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-gray-700 text-white py-6 rounded-2xl hover:bg-[#1a1a1a]"
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="visible"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-google-icon-svg-download-png-1507807.png"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-medium">
            {isSignup ? "Sign up with Google" : "Continue with Google"}
          </span>
        </motion.button>

        {/* Toggle Login / Signup */}
        <motion.p
          className="text-center text-gray-400 text-sm mt-6"
          variants={fadeUp}
          custom={6}
          initial="hidden"
          animate="visible"
        >
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-white font-medium hover:underline"
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </motion.p>
      </form>
    </div>
  );
}
