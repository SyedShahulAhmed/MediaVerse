// // src/pages/VerifyOTP.jsx
// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Shield, CheckCircle } from "lucide-react";
// import toast from "react-hot-toast";
// import API from "../api/axios.js";

// export default function VerifyOTP() {
//   const navigate = useNavigate();
//   const query = new URLSearchParams(useLocation().search);
//   const email = query.get("email");

//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (otp.length !== 6) return toast.error("Enter a valid 6-digit OTP.");

//     try {
//       setLoading(true);
//       const { data } = await API.post("/password/verify-otp", { email, otp });
//       if (data.success) {
//         toast.success("OTP verified!");
//         setTimeout(() => navigate(`/reset-password?email=${email}&otp=${otp}`), 600);
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Invalid or expired OTP.");
//     } finally {
//       setLoading(false);
//     }
//   };
// // 
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0b0f] text-white relative">
//       <div className="absolute inset-0 -z-10">
//         <img src="/bg.gif" alt="bg" className="w-full h-full object-cover" />
//         <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
//       </div>

//       <div className="bg-[#13131a]/80 border border-purple-700/30 p-8 rounded-3xl shadow-[0_0_35px_rgba(155,92,246,0.3)] w-96 text-center">
//         <Shield size={40} className="mx-auto text-purple-400 mb-3" />
//         <h1 className="text-2xl font-bold text-purple-400 mb-2">
//           Verify OTP
//         </h1>
//         <p className="text-gray-400 mb-6">
//           Enter the 6-digit OTP sent to <span className="text-purple-300">{email}</span>
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             maxLength={6}
//             className="w-full text-center bg-[#16161e] text-white text-lg tracking-widest px-4 py-3 rounded-xl border border-purple-700/30 focus:border-purple-500 outline-none transition"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 py-2 rounded-xl font-medium hover:from-purple-500 hover:to-fuchsia-500 transition disabled:opacity-60"
//           >
//             <CheckCircle size={18} />
//             {loading ? "Verifying..." : "Verify OTP"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
