import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [role, setRole] = useState("student");
  const [classLevel, setClassLevel] = useState("Nursery");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Fallback for local development

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isOtpSent) {
      // Validate form before sending OTP
      if (!name || !email || !password || !role) {
        toast.error("Please fill out all required fields.", { position: "top-right", autoClose: 3000 });
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        toast.error("Please enter a valid email address.", { position: "top-right", autoClose: 3000 });
        return;
      }
      if (role === "student" && (!rollNo || !classLevel)) {
        toast.error("Please provide Roll No and Class for students.", { position: "top-right", autoClose: 3000 });
        return;
      }
      if (role === "teacher" && !teacherId) {
        toast.error("Please provide Teacher ID for teachers.", { position: "top-right", autoClose: 3000 });
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL}/api/auth/send-otp`, { email });
        console.log("OTP Sent by Backend:", response.data.otp); // For debugging (remove in production)
        setIsOtpSent(true);
        toast.success("OTP sent to your email. Please verify.", { position: "top-right", autoClose: 3000 });
      } catch (err) {
        console.error("Error Sending OTP:", err);
        toast.error(err.response?.data?.message || "Failed to send OTP. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Verify OTP and complete registration
      if (!otp) {
        toast.error("Please enter the OTP.", { position: "top-right", autoClose: 3000 });
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL}/api/auth/verify-otp`, { email, otp });
        console.log("OTP Verification Response:", response.data); // For debugging (remove in production)

        if (response.data.success) {
          const formData = new FormData();
          formData.append("name", name);
          formData.append("email", email);
          formData.append("password", password);
          formData.append("role", role);

          if (role === "student") {
            formData.append("rollNo", rollNo);
            formData.append("classLevel", classLevel);
          } else if (role === "teacher") {
            formData.append("teacherId", teacherId);
          }

          if (role !== "visit" && profilePic) {
            formData.append("profilePic", profilePic);
          }

          console.log("Form Data Sent to Backend:", Object.fromEntries(formData)); // For debugging (remove in production)

          await axios.post(`${API_URL}/api/auth/register`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          toast.success("Registration successful! Redirecting to login...", {
            position: "top-right",
            autoClose: 3000,
          });
          setTimeout(() => navigate("/login"), 3000);

          // Reset form and file input
          setName("");
          setEmail("");
          setPassword("");
          setRollNo("");
          setTeacherId("");
          setProfilePic(null);
          setRole("student");
          setClassLevel("Nursery");
          setOtp("");
          setIsOtpSent(false);
          document.getElementById("profilePic")?.setAttribute("value", "");
        } else {
          toast.error("Invalid OTP. Please try again.", { position: "top-right", autoClose: 3000 });
        }
      } catch (err) {
        console.error("Error Verifying OTP:", err);
        toast.error(err.response?.data?.message || "Failed to verify OTP. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="/logo.png"
          alt="Ashoka Vidya Mandir Logo"
          className="w-24 mx-auto mb-6"
        />
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleRegister}>
          {!isOtpSent ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="visit">Visit</option>
                </select>
              </div>
              {role === "student" && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700">Roll No</label>
                    <input
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700">Class</label>
                    <select
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    >
                      <option value="Nursery">Nursery</option>
                      <option value="LKG">LKG</option>
                      <option value="UKG">UKG</option>
                      <option value="1st Grade">1st Grade</option>
                      <option value="2nd Grade">2nd Grade</option>
                      <option value="3rd Grade">3rd Grade</option>
                      <option value="4th Grade">4th Grade</option>
                      <option value="5th Grade">5th Grade</option>
                      <option value="6th Grade">6th Grade</option>
                      <option value="7th Grade">7th Grade</option>
                      <option value="8th Grade">8th Grade</option>
                      <option value="9th Grade">9th Grade</option>
                      <option value="10th Grade">10th Grade</option>
                    </select>
                  </div>
                </>
              )}
              {role === "teacher" && (
                <div className="mb-4">
                  <label className="block text-gray-700">Teacher ID</label>
                  <input
                    type="text"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              )}
              {role !== "visit" && (
                <div className="mb-4">
                  <label className="block text-gray-700">Profile Picture</label>
                  <input
                    id="profilePic"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePic(e.target.files[0])}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="mb-4">
              <label className="block text-gray-700">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          )}
          <motion.button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : isOtpSent ? "Verify OTP" : "Send OTP"}
          </motion.button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;