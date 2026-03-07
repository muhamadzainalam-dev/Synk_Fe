import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuArrowLeft } from "react-icons/lu";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

const SERVER_URI = import.meta.env.VITE_SERVER_URI;
const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function OTPPage() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (canResend) return;
    if (countdown === 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, canResend]);

  const focusInput = (idx) => inputRefs.current[idx]?.focus();

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < OTP_LENGTH - 1) focusInput(idx + 1);
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (otp[idx]) {
        const next = [...otp];
        next[idx] = "";
        setOtp(next);
      } else if (idx > 0) {
        focusInput(idx - 1);
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      focusInput(idx - 1);
    } else if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) {
      focusInput(idx + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setOtp(next);
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const handleSubmit = async () => {
    const code = otp.join("").trim();

    if (code.length !== OTP_LENGTH) {
      triggerShake();
      return;
    }

    console.log({ OTP: code });
    try {
      setStatus("loading");

      const response = await axios.post(
        `${SERVER_URI}/verifyotp`,
        { OTP: code },
        {
          withCredentials: true,
        },
      );

      console.log("Server Response:", response);

      setStatus("success");

      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );

      setStatus("error");
      setMessage(error.response?.data?.message);
      triggerShake();

      focusInput(0);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101010]">
      <div className="w-full max-w-sm px-4 sm:px-0 mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mt-2 mb-8"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Verify your email
          </h1>
        </motion.div>

        {/* OTP Inputs */}
        <motion.div
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex justify-center gap-3"
            animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {otp.map((digit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + idx * 0.06,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <input
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={handlePaste}
                  className={`
                    w-12 h-14 sm:w-14 sm:h-16 text-center text-white text-xl font-bold
                    rounded-2xl bg-[#1e1e1e] border-2 transition-all duration-200
                    focus:outline-none caret-transparent
                    ${
                      status === "error"
                        ? "border-red-500 bg-red-500/10"
                        : status === "success"
                          ? "border-green-500 bg-green-500/10"
                          : digit
                            ? "border-gray-500"
                            : "border-transparent focus:border-gray-600"
                    }
                  `}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Error / Success message */}
          <AnimatePresence mode="wait">
            {status === "error" && (
              <motion.p
                key="error"
                className="text-red-500 text-xs text-center mt-3"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Verify Button */}
        <motion.button
          onClick={handleSubmit}
          disabled={status === "loading" || status === "success"}
          className="w-full mt-6 bg-white text-black font-semibold py-4 rounded-2xl disabled:opacity-60 transition-opacity"
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="visible"
          whileHover={status === "idle" ? { scale: 1.02 } : {}}
          whileTap={status === "idle" ? { scale: 0.97 } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <AnimatePresence mode="wait">
            {status === "loading" ? (
              <motion.span
                key="loading"
                className="flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Spinner /> Verifying...
              </motion.span>
            ) : status === "success" ? (
              <motion.span
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-1"
              >
                <IoCheckmarkCircleSharp /> Verified
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Verify code
              </motion.span>
            )}
          </AnimatePresence>
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

        {/* Back to login */}
        <motion.div
          className="text-center mt-4"
          variants={fadeUp}
          custom={6}
          initial="hidden"
          animate="visible"
        >
          <button className="text-gray-400 text-sm hover:underline hover:text-white transition-colors">
            {canResend ? (
              <a href="/auth">
                <div className="flex items-center justify-center gap-1">
                  <LuArrowLeft />
                  Back to log in
                </div>
              </a>
            ) : (
              `${countdown}s`
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// Inline spinner so no extra deps needed
const Spinner = () => (
  <svg
    className="animate-spin w-4 h-4 text-black"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);
