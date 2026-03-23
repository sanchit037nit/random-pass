import React, { useState } from "react";
import { usePasStore } from "../store/usepasstore.js";
import { useAuthStore } from "../store/useauthstore.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "@splinetool/viewer";

const Createpage = () => {
  const navigate = useNavigate();
  const { createpass, generatedPassword } = usePasStore();
  const { authUser } = useAuthStore();

  const [show, setShow] = useState(false);

  const [formdata, setformdata] = useState({
    name: "",
    password: generatedPassword || "",
    description: "",
    group: "General",
    createdby: authUser?._id,
  });

  const handleclick = (e) => {
    e.preventDefault();

    if (!(formdata.name && formdata.password && formdata.description)) {
      return toast.error("All fields are required");
    }

    createpass(formdata);
    toast.success("Password saved!");

    navigate("/home");

    setformdata({
      name: "",
      password: "",
      group: "General",
      description: "",

    });
  };

  const handlecross = (e) => {
    e.preventDefault();
    navigate("/ranpass");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative text-white">

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-wide">
            🔐 Add Password
          </h2>

          <button
            onClick={handlecross}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500 transition"
          >
            ❌
          </button>
        </div>

        <form className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-gray-300 block mb-1">
              Name
            </label>

            <input
              type="text"
              placeholder="Github / Gmail / Instagram"
              value={formdata.name}
              onChange={(e) =>
                setformdata({ ...formdata, name: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 block mb-1">
              Password
            </label>

            <div className="flex gap-2">

              <input
                type={show ? "text" : "password"}
                placeholder="Enter password"
                value={formdata.password}
                onChange={(e) =>
                  setformdata({ ...formdata, password: e.target.value })
                }
                className="flex-1 px-4 py-2 rounded-lg bg-black/40 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShow(!show)}
                className="px-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              >
                {show ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-300 block mb-1">
              Description
            </label>

            <textarea
              placeholder="Optional details..."
              value={formdata.description}
              onChange={(e) =>
                setformdata({ ...formdata, description: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-600 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Group section */}
          <div>
  <label className="text-gray-300 block mb-1">
    Group
  </label>

  <select
    value={formdata.group}
    onChange={(e) =>
      setformdata({ ...formdata, group: e.target.value })
    }
    className="w-full px-4 py-2 rounded-lg bg-black/40 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="General">General</option>
    <option value="Work">Work</option>
    <option value="Social">Social</option>
    <option value="Banking">Banking</option>
    <option value="Shopping">Shopping</option>
  </select>
          </div>
          
          {/* Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleclick}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 py-2 rounded-lg font-semibold tracking-wide shadow-lg transition"
          >
            Save Password
          </motion.button>

        </form>
      </motion.div>
    </div>
  );
};

export default Createpage;