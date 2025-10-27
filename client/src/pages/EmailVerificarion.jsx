import { useState, useRef, useEffect } from "react";
import API from "../api/axios.js";
import toast from "react-hot-toast";

export default function EmailVerification({ onVerified }) {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const intervalRef = useRef(null);

  // 🧹 Clear timer when unmounting
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const sendOTP = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsSending(true);
      const res = await API.post("/api/otp/send", { email });
      toast.success(res.data.message || "OTP sent to your email");
      setStep(2);
      setTimer(300); // 5 minutes

      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSending(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsVerifying(true);
      const res = await API.post("/api/otp/verify", { email, otp });
      toast.success(res.data.message || "Email verified successfully");
      clearInterval(intervalRef.current);
      onVerified(email);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (t) =>
    `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-[#0d0d0f] px-4">
      {/* Step 1: Enter Email */}
      {step === 1 && (
        <div className="w-full max-w-sm bg-[#141418] p-6 rounded-2xl shadow-[0_0_20px_rgba(124,58,237,0.15)] border border-[#2d2d38]/60">
          <h2 className="text-2xl font-bold mb-5 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
            Verify Your Email
          </h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-3 rounded-lg bg-[#1c1b22] text-white mb-4 border border-[#2f2b3e] focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all"
          />
          <button
            onClick={sendOTP}
            disabled={isSending}
            className="bg-gradient-to-r from-purple-600 to-fuchsia-500 px-4 py-2.5 rounded-lg w-full font-medium hover:opacity-90 transition-all shadow-[0_0_15px_rgba(155,92,246,0.3)] disabled:opacity-60"
          >
            {isSending ? "Sending..." : "Send OTP"}
          </button>
        </div>
      )}

      {/* Step 2: Enter OTP */}
      {step === 2 && (
        <div className="w-full max-w-sm bg-[#141418] p-6 rounded-2xl shadow-[0_0_20px_rgba(124,58,237,0.15)] border border-[#2d2d38]/60">
          <h2 className="text-2xl font-bold mb-5 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
            Enter OTP
          </h2>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOTP(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="w-full p-3 rounded-lg bg-[#1c1b22] text-white mb-3 text-center tracking-widest text-lg border border-[#2f2b3e] focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all"
          />

          <p className="text-sm text-gray-400 mb-3 text-center">
            ⏳ Time left:{" "}
            <span className="text-fuchsia-400 font-semibold">
              {formatTime(timer)}
            </span>
          </p>

          <button
            onClick={verifyOTP}
            disabled={isVerifying || timer === 0}
            className="bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-2.5 rounded-lg w-full font-medium hover:opacity-90 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] disabled:opacity-60"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            onClick={sendOTP}
            disabled={timer > 270 || isSending}
            className="text-fuchsia-400 mt-3 underline text-sm w-full disabled:opacity-40 disabled:cursor-not-allowed hover:text-fuchsia-300 transition"
          >
            Resend OTP
          </button>

          {timer === 0 && (
            <p className="text-xs text-red-400 text-center mt-2">
              OTP expired. Please resend to get a new one.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
