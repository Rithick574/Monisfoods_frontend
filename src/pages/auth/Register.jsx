// import { useState, useEffect } from "react";
// import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
// import { CgSpinner } from "react-icons/cg";
// import OtpInput from "otp-input-react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { auth } from "../../firebase";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { toast, Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const [otp, setOtp] = useState("");
//   const [ph, setPh] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showOTP, setShowOTP] = useState(false);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) {
//       setTimeout(() => {
//         navigate('/home');
//       }, 2000);
//     }
//   }, [user, navigate]);

//   function onCaptchVerify() {
//     if (!window.recaptchaVerifier) {
//       try {
//         window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
//           size: "invisible",
//           callback: () => {
//           },
//           'expired-callback': () => {
//             toast.error("reCAPTCHA expired. Please try again.");
//           }
//         });
//       } catch (error) {
//         console.error("Error initializing reCAPTCHA:", error);
//         toast.error("Error initializing verification. Please try again.");
//       }
//     }
//   }

//   async function onSignup() {
//     try {
//       setLoading(true);
//       onCaptchVerify();

//       const formatPh = "+" + ph;
//       const appVerifier = window.recaptchaVerifier;

//       if (!appVerifier) {
//         throw new Error("reCAPTCHA verifier not initialized");
//       }

//       const confirmationResult = await signInWithPhoneNumber(auth, formatPh, appVerifier);
//       window.confirmationResult = confirmationResult;
//       setLoading(false);
//       setShowOTP(true);
//       toast.success("OTP sent successfully!");
//     } catch (error) {
//       console.error("Error during signup:", error);
//       setLoading(false);
//       toast.error(error.message || "Failed to send OTP. Please try again.");
      
//       if (window.recaptchaVerifier) {
//         window.recaptchaVerifier.clear();
//         window.recaptchaVerifier = null;
//       }
//     }
//   }

//   async function onOTPVerify() {
//     try {
//       setLoading(true);
//       const result = await window.confirmationResult.confirm(otp);
//       setUser(result.user);
//       setLoading(false);
//       toast.success("Phone number verified successfully!");
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       setLoading(false);
//       toast.error("Invalid OTP. Please try again.");
//     }
//   }

//   return (
//     <section className="bg-emerald-500 flex items-center justify-center h-screen">
//       <div>
//         <Toaster toastOptions={{ duration: 4000 }} />
//         <div id="recaptcha-container"></div>
//         {user ? (
//           <div className="text-center text-white">
//             <h2 className="font-medium text-2xl mb-4">
//               👍 Registration Successful
//             </h2>
//             <p>Redirecting to home page...</p>
//           </div>
//         ) : (
//           <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
//             <h1 className="text-center leading-normal text-white font-medium text-3xl mb-6">
//               Welcome to <br /> MONIS FOODS
//             </h1>
//             {showOTP ? (
//               <>
//                 <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
//                   <BsFillShieldLockFill size={30} />
//                 </div>
//                 <label
//                   htmlFor="otp"
//                   className="font-bold text-xl text-white text-center"
//                 >
//                   Enter your OTP
//                 </label>
//                 <OtpInput
//                   value={otp}
//                   onChange={setOtp}
//                   OTPLength={6}
//                   otpType="number"
//                   disabled={false}
//                   autoFocus
//                   className="opt-container"
//                 />
//                 <button
//                   onClick={onOTPVerify}
//                   className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
//                 >
//                   {loading && (
//                     <CgSpinner size={20} className="mt-1 animate-spin" />
//                   )}
//                   <span>Verify OTP</span>
//                 </button>
//               </>
//             ) : (
//               <>
//                 <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
//                   <BsTelephoneFill size={30} />
//                 </div>
//                 <label
//                   htmlFor=""
//                   className="font-bold text-xl text-white text-center"
//                 >
//                   Verify your phone number
//                 </label>
//                 <PhoneInput
//                   country={"in"}
//                   value={ph}
//                   onChange={setPh}
//                   inputStyle={{ width: '100%' }}
//                 />
//                 <button
//                   onClick={onSignup}
//                   className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
//                 >
//                   {loading && (
//                     <CgSpinner size={20} className="mt-1 animate-spin" />
//                   )}
//                   <span>Send code via SMS</span>
//                 </button>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default Register;


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { sendOtp, verifyOtp, setUserPassword } from "../../redux/reducers/user/authSlice";
import * as Yup from "yup";
import { ToastContainer } from "react-toastify";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector((state) => state.auth.role);
  const { otpSent, otpVerified, passwordSet, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("teacher"); // Default to "teacher"

  const emailValidationSchema = Yup.string()
    .email("Invalid email address")
    .required("Email is required");

  const otpValidationSchema = Yup.string()
    .matches(/^\d{6}$/, "OTP must be a 6-digit number")
    .required("OTP is required");

  const passwordValidationSchema = Yup.string()
    .matches(/^\d{4}$/, "Password must be a 4-digit number")
    .required("Password is required");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  if (passwordSet) {
    navigate('/home');  
  }

  const handleSendOtp = async () => {
    try {
      await emailValidationSchema.validate(email);
      dispatch(sendOtp({ email, role })); 
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await otpValidationSchema.validate(otp);
      dispatch(verifyOtp({ email, otp, role })); 
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSetPassword = async () => {
    try {
      await passwordValidationSchema.validate(password);
      dispatch(setUserPassword({ email, password, role })); 
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

        {!otpSent ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4"
              placeholder="Enter your email"
              disabled={loading}
            />
            <div className="mb-4">
              <label className="block text-gray-700">Select Role</label>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="teacher"
                  name="role"
                  value="teacher"
                  checked={role === "teacher"}
                  onChange={() => setRole("teacher")}
                  className="mr-2"
                />
                <label htmlFor="teacher" className="text-gray-700">Teacher</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="parent"
                  name="role"
                  value="parent"
                  checked={role === "parent"}
                  onChange={() => setRole("parent")}
                  className="mr-2"
                />
                <label htmlFor="parent" className="text-gray-700">Parent</label>
              </div>
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-500 text-white p-3 rounded flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Send OTP"
              )}
            </button>
          </>
        ) : !otpVerified ? (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4"
              placeholder="Enter OTP"
              maxLength={6}
              disabled={loading}
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-500 text-white p-3 rounded flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Verify OTP"
              )}
            </button>
          </>
        ) : !passwordSet ? (
          <>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4"
              placeholder="Set a 4-digit PIN"
              maxLength={4}
              disabled={loading}
            />
            <button
              onClick={handleSetPassword}
              className="w-full bg-blue-500 text-white p-3 rounded flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                "Set Password"
              )}
            </button>
          </>
        ) : (
          <div className="text-center text-green-500">Signup Successful! Redirecting...</div>
        )}
      </div>
    </div>
  );
};

export default Signup;
