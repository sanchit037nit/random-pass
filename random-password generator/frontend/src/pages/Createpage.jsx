
import React, { useState } from 'react';
import { usePasStore } from '../store/usepasstore.js';
import { useAuthStore } from '../store/useauthstore.js';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Createpage = () => {
  const navigate = useNavigate();
  const { createpass, updatepass,generatedPassword } = usePasStore();
  const { authUser } = useAuthStore();

  const [formdata, setformdata] = useState({
    name: '',
    password: generatedPassword || '',
    description: '',
    createdby: authUser?._id,
  });

  const handleclick = (e) => {
    e.preventDefault();
    if (!(formdata.name && formdata.password && formdata.description)) {
      return toast.error('All fields are required');
    }
    createpass(formdata);
    navigate('/home');
    setformdata({ name: '', password: '', description: '' });
  };

    const handlecross = (e) => {
    e.preventDefault();
    navigate('/ranpass');
  }


  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
          <spline-viewer
        url="https://prod.spline.design/cwq814qIdbhTkjqB/scene.splinecode"
        background="transparent"
        class="absolute top-0 left-0 w-full h-full z-[-1]"
      ></spline-viewer>

      <div className=" rounded-2xl shadow-lg p-8 w-full max-w-md ">
        <div className='flex justify-between items-center mb-6'>
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Manage Password</h2>
          
          <div className="flex items-center justify-center w-7 h-7 bg-gray-100 rounded-full transition-colors duration-200">
  <button 
    onClick={handlecross}
    className="text-sm leading-none text-gray-600 hover:text-red-600 focus:outline-none"
  >
    ❌
  </button>
  </div>
</div>

        <form className="space-y-4">
          <div>
            <label className="text-gray-300 block mb-1">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name of password"
              value={formdata.name}
              onChange={(e) => setformdata({ ...formdata, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-1">Password</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              value={formdata.password}
              onChange={(e) => setformdata({ ...formdata, password: e.target.value })}
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-1">Description</label>
            <textarea
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
              value={formdata.description}
              onChange={(e) => setformdata({ ...formdata, description: e.target.value })}
            />
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleclick}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Create
            </button>
           
          </div>
        </form>
      </div>
    </div>
  );
};

export default Createpage;
