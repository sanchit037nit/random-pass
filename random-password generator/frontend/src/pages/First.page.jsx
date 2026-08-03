import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer.jsx";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useauthstore.js";

/**
 * THEME: "Cipher Vault"
 * Add this once to your index.html <head> if these fonts aren't already loaded:
 * <link rel="preconnect" href="https://fonts.googleapis.com">
 * <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Manrope:wght@400;500;700;800&display=swap" rel="stylesheet">
 */

const CHARSET = "!<>-_\\/[]{}—=+*^?#________";

// ===== Hash-stream marquee (replaces the emoji ticker) =====
const HashStream = () => {
  const text =
    "AES-256 • ARGON2ID • CSPRNG • ZERO-KNOWLEDGE • ENTROPY 128-BIT • ";

  return (
    <div className="overflow-hidden w-full py-2 bg-[#111827] border-y border-[#1F2937]">
      <motion.div
        className="inline-block whitespace-nowrap font-mono text-[#8B93A7] text-sm tracking-widest uppercase"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
      >
        {Array(8).fill(text).join("")}
      </motion.div>
    </div>
  );
};

// ===== Signature element: decrypting headline =====
const DecryptText = ({ text, className }) => {
  const [display, setDisplay] = useState(text.split("").map(() => " "));
  const frame = useRef(0);
  const resolved = useRef(0);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        frame.current += 1;

        setDisplay((prev) =>
          text.split("").map((char, i) => {
            if (char === " ") return " ";
            if (i < resolved.current) return char;
            return CHARSET[Math.floor(Math.random() * CHARSET.length)];
          })
        );

        if (frame.current % 3 === 0 && resolved.current <= text.length) {
          resolved.current += 1;
        }

        if (resolved.current > text.length) {
          clearInterval(interval);
          setDisplay(text.split(""));
        }
      }, 40);

      return () => clearInterval(interval);
    }, 400);

    return () => clearTimeout(startDelay);
  }, [text]);

  return (
    <h1 className={className} aria-label={text}>
      {display.join("")}
    </h1>
  );
};

// ===== Firstpage Component =====
export const Firstpage = () => {
  const { authUser } = useAuthStore();

  const handleClick = () => {
    if (!authUser) {
      toast.error("Login required to generate a password");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }
    window.location.href = "/ranpass";
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#0A0E14]">
      {/* Ambient glow field */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-[#34D399]/10 blur-[120px]" />
        <div className="absolute bottom-0 -right-24 w-[420px] h-[420px] rounded-full bg-[#7C6FF0]/10 blur-[120px]" />
      </div>

      {/* Subtle dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(#1F2937 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Hash-stream ticker */}
      <div className="relative z-[1]">
        <HashStream />
      </div>

      {/* Main Content */}
      <div className="relative z-[1] flex flex-col flex-grow justify-center items-center text-center py-20 px-6">
        {/* Eyebrow / status badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-[#1F2937] bg-[#111827] font-mono text-xs tracking-[0.2em] uppercase text-[#8B93A7]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]" />
          </span>
          Engine online — generating entropy
        </motion.div>

        {/* Signature: decrypting headline */}
        <DecryptText
          text="WELCOME"
          className="font-mono text-6xl sm:text-5xl font-bold tracking-[0.15em] mb-6 text-[#E6E8EC]"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="max-w-xl mb-10 text-lg text-[#8B93A7] leading-relaxed"
        >
          Generate strong, random passwords and keep every credential
          somewhere no one else can reach.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="px-7 py-3 rounded-lg bg-[#34D399] text-[#0A0E14] font-semibold shadow-[0_0_0_1px_rgba(52,211,153,0.4)] hover:shadow-[0_0_24px_rgba(52,211,153,0.45)] transition-shadow"
            onClick={handleClick}
          >
            Generate password
          </motion.button>

          <motion.button
            whileHover={{ y: -2, borderColor: "#7C6FF0" }}
            whileTap={{ scale: 0.97 }}
            className="px-7 py-3 rounded-lg border border-[#1F2937] text-[#E6E8EC] font-semibold hover:shadow-[0_0_24px_rgba(124,111,240,0.35)] transition-shadow"
            onClick={() => (window.location.href = "/signup")}
          >
            Sign up
          </motion.button>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mt-14 flex items-center gap-6 font-mono text-xs tracking-widest uppercase text-[#8B93A7]/70"
        >
          <span>No storage of plaintext</span>
          <span className="w-1 h-1 rounded-full bg-[#1F2937]" />
          <span>Client-side generation</span>
          <span className="w-1 h-1 rounded-full bg-[#1F2937]" />
          <span>Open by design</span>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="relative z-[1]"
      >
        <Footer />
      </motion.div>
    </div>
  );
};

// export default Firstpage;