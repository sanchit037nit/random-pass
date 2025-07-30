
import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useauthstore.js';
import { usePasStore } from '../store/usepasstore.js';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { motion } from 'framer-motion';
import { useState } from 'react';

export const Homepage = () => {
  const { authUser, logout, deleteaccount } = useAuthStore();
  const { getpass, passes ,deletepass} = usePasStore();
  const navigate = useNavigate();
  const [visibleIds, setVisibleIds] = useState([]);
  const [spass,setspass] = useState("");
  const [sort,setsort] = useState(false);
  const orderedpasses=[...passes]



  if(sort){
    // orderedpasses.push(passes)
    console.log(orderedpasses)
    orderedpasses.sort((a, b) => a.name.localeCompare(b.name))
    console.log(orderedpasses)
  }

  const toggleView = (id) => {
    setVisibleIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };
  const id = authUser._id;

  useEffect(() => {
    getpass(id);
  }, [id]);



  const handleView = (e, passId) => {
    e.preventDefault();
    usePasStore.getState().viewpass(passId, navigate);
  };

  const handleDelete = (e, passId) => {
    e.preventDefault();
    deletepass(passId);
  };

    const handleCopy = (e,id) => {
    e.preventDefault();
    const pass=passes.find((p) => p._id == id)
    navigator.clipboard.writeText(pass.password);
   };

  const handleSort = () => {
    setsort(!sort)
  }


  return (
    <div className="flex flex-col  gap-5 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white font-sans tracking-wide">
      <div className='w-full m-0 mb-2'>
      <Navbar/>
     </div>

      <div className="flex justify-center items-center text-3xl font-extrabold underline tracking-tight">
        MY PASSWORDS
      </div>

     
     <div className='flex justify-between items-center mb-4  m-10'>
     <input type="text" value={spass} onChange={(e) => setspass(e.target.value)} placeholder="Search passwords..." className="p-2 rounded-md bg-gray-800 border border-gray-700" /> 
     <div className="flex gap-2">
      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" onClick={handleSort}>
      { sort ? "Unsort" : "Sort"}
      </button>
   </div>
     </div>

      <div className="space-y-5 p-6">
        {
           orderedpasses?.filter((pass) => pass.name.toLowerCase().includes(spass.toLowerCase())).map((pass) => (
          <motion.div
            key={pass._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900/60 backdrop-blur-md p-4 rounded-xl shadow-lg hover:scale-[1.023] hover:shadow-[0_0_10px_rgba(124,58,237,0.6)] transition-all duration-200 flex justify-between items-start border border-gray-700"
          >
            <div className="space-y-1 text-left">
              <p className="text-white text-lg font-medium">
                Name:{" "}
                <span className="text-gray-300 font-normal">
                  {pass.name}
                </span>
              </p>
              <p className="text-white text-lg font-medium flex items-center gap-2">
                Password:{" "}
                <span className="text-gray-300 font-normal">
                  {visibleIds.includes(pass._id) ? pass.password : "••••••••"}
                </span>
                <button
                  onClick={() => toggleView(pass._id)}
                  className="text-xl hover:scale-110 transition-transform"
                >
                  {visibleIds.includes(pass._id) ? "🙈" : "👁️"}
                </button>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                className="bg-violet-500 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition duration-150 shadow"
                onClick={(e) => handleDelete(e, pass._id)}
              >
                Delete
              </button>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md transition duration-150 shadow"
                onClick={(e) => handleView(e, pass._id)}
              >
                View/Update
              </button>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-black px-4 py-2 rounded-md transition duration-150 shadow"
                onClick={(e) => handleCopy(e,pass._id)}
              >
                Copy
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

  );
};