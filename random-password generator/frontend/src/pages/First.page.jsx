import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { motion } from "framer-motion";
import "@splinetool/viewer";

export const Firstpage = () => {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Navbar />

      <spline-viewer
        url="https://prod.spline.design/cwq814qIdbhTkjqB/scene.splinecode"
        background="transparent"
        className="absolute top-0 left-0 w-full h-full z-[-1]"
      ></spline-viewer>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-[1] flex-grow flex-col justify-center min-h-screen items-center py-16 px-6 text-white "
      >
        <motion.h1
          className="text-5xl font-extrabold tracking-wider mb-4 flex items-center gap-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          🔐 WELCOME
        </motion.h1>

        <motion.p
          className="text-xl text-center max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          This is a password generator app — a complete solution for password
          management.
        </motion.p>
      </motion.div>

      <Footer />
    </div>
  );
};
