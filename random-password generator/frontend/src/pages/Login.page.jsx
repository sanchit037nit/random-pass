import { useState } from "react";
import { useAuthStore } from "../store/useauthstore.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "@splinetool/viewer";

export const Loginpage = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [formdata, setformdata] = useState({
    emailid: "",
    password: "",
  });

  const handleclick = (e) => {
    e.preventDefault();

    if (!formdata.emailid || !formdata.password) {
      return toast.error("All fields required");
    }

    login(formdata);
  };

  const handlecross = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen relative">

      {/* Background */}
      {/* <spline-viewer
        url="https://prod.spline.design/cwq814qIdbhTkjqB/scene.splinecode"
        background="transparent"
        class="absolute top-0 left-0 w-full h-full z-[-1]"
      ></spline-viewer> */}

      {/* Login Form */}
      <form
        onSubmit={handleclick}
        className="space-y-7 text-white w-full max-w-md p-8 rounded-lg backdrop-blur-md shadow-xl"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Login Form</h2>

          <button
            onClick={handlecross}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-100"
          >
            ❌
          </button>
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-lg">
            Enter your Email
          </label>

          <input
            type="email"
            id="email"
            className="border border-gray-400 rounded-md px-4 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Enter your email"
            value={formdata.emailid}
            onChange={(e) =>
              setformdata({ ...formdata, emailid: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="password" className="text-lg">
            Enter your Password
          </label>

          <input
            type="password"
            id="password"
            className="border border-gray-400 rounded-md px-4 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Enter your password"
            value={formdata.password}
            onChange={(e) =>
              setformdata({ ...formdata, password: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-2 rounded-md transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};