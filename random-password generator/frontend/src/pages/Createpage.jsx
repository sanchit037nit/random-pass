
import React, { useState } from 'react';
import { usePasStore } from '../store/usepasstore.js';
import { useAuthStore } from '../store/useauthstore.js';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Createpage = () => {
  const navigate = useNavigate();
  const { createpass, updatepass } = usePasStore();
  const { authUser } = useAuthStore();

  const [formdata, setformdata] = useState({
    pname: '',
    ppass: '',
    description: '',
    createdby: authUser?._id,
  });

  const handleclick = (e) => {
    e.preventDefault();
    if (!(formdata.pname && formdata.ppass && formdata.description)) {
      return toast.error('All fields are required');
    }
    createpass(formdata);
    navigate('/home');
    setformdata({ pname: '', ppass: '', description: '' });
  };

  const handleupdate = (e) => {
    e.preventDefault();
    updatepass(formdata);
    navigate('/home');
    setformdata({ pname: '', ppass: '', description: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Manage Password</h2>

        <form className="space-y-4">
          <div>
            <label className="text-gray-300 block mb-1">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name of password"
              value={formdata.pname}
              onChange={(e) => setformdata({ ...formdata, pname: e.target.value })}
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-1">Password</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              value={formdata.ppass}
              onChange={(e) => setformdata({ ...formdata, ppass: e.target.value })}
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
            <button
              onClick={handleupdate}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Createpage;
