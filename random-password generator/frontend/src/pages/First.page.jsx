
import Footer from "../components/Footer.jsx";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useauthstore.js";


const MovingText = () => {
  const text = "🔐 Secure Passwords • 🔑 Strong & Random • 🛡️ Your Privacy Matters • ";

  return (
    <div className="overflow-hidden w-full py-2 bg-gray-800/60">
      <motion.div
        className="inline-block whitespace-nowrap text-white font-semibold text-xl"
        animate={{ x: ["100%", "-100%"] }}
        transition={{
          repeat: Infinity,
          duration: 400, // VERY slow
          ease: "linear",
        }}
      >
        {Array(5).fill(text + "       ").join("")} {/* spaces between repeats */}
      </motion.div>
    </div>
  );
};


// ===== Animated Central Text Component =====
const AnimatedText = ({ text }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.3 },
    },
  };

  const child = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  return (
    <motion.h1
      className="text-6xl sm:text-5xl font-extrabold tracking-wider mb-6 flex gap-2 flex-wrap justify-center text-white"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={child}
          whileHover={{ scale: 1.3, rotate: [0, 5, -5, 0] }}
          className="inline-block"
        >
          {letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

  
// ===== Firstpage Component =====
export const Firstpage = () => {
  
const { authUser } = useAuthStore()

  const handleClick = () => {
if (!authUser) {
  toast.error("⚠️ Login required to generate password!");
  setTimeout(() => {
    window.location.href = "/login";
  }, 1500); // wait 1.5 seconds
  return;
}
    window.location.href = "/ranpass"; // Redirect if logged in
  };
  
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-800">
      


      {/* Floating decorative emojis */}
      <motion.div
        className="absolute top-10 left-5 text-4xl opacity-70"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        🔐
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 text-3xl opacity-60"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        🔑
      </motion.div>

      {/* Moving Text / Marquee */}
      <MovingText />

      {/* Main Content */}
      <motion.div
        className="relative z-[1] flex flex-col flex-grow justify-center items-center text-center py-16 px-6 text-white"
      >
        {/* Central Animated Text */}
        <AnimatedText text="🔐 WELCOME" />

        {/* Floating Paragraph */}
        <motion.p
          className="text-xl sm:text-lg max-w-2xl mb-8 opacity-80 text-white"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          This is a password generator app — a complete solution for password management.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex gap-4 flex-wrap justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, staggerChildren: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 3 }}
            whileTap={{ scale: 0.95, rotate: -2 }}
            className="px-6 py-3 rounded-full bg-amber-500 text-gray-900 font-semibold hover:shadow-lg transition-all"
            onClick={handleClick}
          >
            Generate Password
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 3 }}
            whileTap={{ scale: 0.95, rotate: -2 }}
            className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:shadow-lg transition-all"
            onClick={() => window.location.href = "/signup"}
          >
            Sign Up
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <Footer />
      </motion.div>
    </div>
  );
};

// export default Firstpage;