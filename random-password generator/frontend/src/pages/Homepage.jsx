// import React from 'react' 
// import { useAuthStore } from '../store/useauthstore.js'
// import { usePasStore } from '../store/usepasstore.js'  
// import { useEffect } from 'react'
// import { useNavigate } from 'react-router-dom';

// export const   Homepage=  () => {
//     const {authUser,logout} = useAuthStore()
//     const {getpass ,passes,viewpass} = usePasStore()
//     const navigate = useNavigate();
//     const {deleteaccount} = useAuthStore()


//     const id=authUser._id
 
//     useEffect(() => {
//     getpass(id);
//     }, [id]);

//     const handleclick=(e)=>{
//       e.preventDefault()
//        logout()
//     }
 
//     const handledelete=(e)=>{
//       e.preventDefault()
//       deleteaccount()
//     }

//     const handleview=(e,id)=>{
//      e.preventDefault()
//      usePasStore.getState().viewpass(id, navigate);
//     }

//   return (

//     <div className="p-6 bg-gray-800 min-h-screen">
//       <span>
//         <div className="  flex justify-between">
//     <div className="text-white text-2xl font-bold mb-4 underline flex justify-between">MY PASSWORDS   </div>
//      <div className="flex justify-end mb-4 p-2 bg-gray-800 rounded text-white">
//   <button
//     onClick={handleclick}
//     className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
//   >
//     Logout
//   </button>

//   <button
//     onClick={handledelete}
//     className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
//   >
//     Delete Account
//   </button>
// </div>

//     </div>
 
//   </span>


// <div className="space-y-4 ">
//   {passes?.map((pass) => (
//     <div
//       key={pass._id}
//       className="bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-[1.023] transition-transform duration-200 flex justify-between items-center"
//     >
//       <div>
//         <p className="text-white font-semibold">Name: <span className="font-normal">{pass.name}</span></p>
//         <p className="text-white font-semibold">Password: <span className="font-normal">{pass.password}</span></p>
//       </div>
      
//       <div className="flex gap-3" >
//         <button className="bg-violet-300 hover:bg-violet-600 text-black px-3 py-1 rounded shadow" onClick={(e) => handledelete(e, pass._id)}>
//           Delete
//         </button>
        
//         <button className="bg-amber-500 hover:bg-amber-600 text-black px-3 py-1 rounded shadow" onClick={(e) => handleview(e, pass._id)}>
//           View
//         </button>
//       </div>
//     </div>
//   ))}
// </div>
//  </div>
//   )
// }


import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useauthstore.js';
import { usePasStore } from '../store/usepasstore.js';
import { useNavigate } from 'react-router-dom';

export const Homepage = () => {
  const { authUser, logout, deleteaccount } = useAuthStore();
  const { getpass, passes } = usePasStore();
  const navigate = useNavigate();

  const id = authUser._id;

  useEffect(() => {
    getpass(id);
  }, [id]);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  const handleAccountDelete = (e) => {
    e.preventDefault();
    deleteaccount();
  };

  const handleView = (e, passId) => {
    e.preventDefault();
    usePasStore.getState().viewpass(passId, navigate);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white font-sans tracking-wide">
      <div className="flex justify-between items-center mb-6">
        <div className="text-3xl font-extrabold underline tracking-tight">
          MY PASSWORDS
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-5 rounded-lg shadow transition-transform hover:scale-105"
          >
            Logout
          </button>
          <button
            onClick={handleAccountDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-5 rounded-lg shadow transition-transform hover:scale-105"
          >
            Delete Account
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {passes?.map((pass) => (
          <div
            key={pass._id}
            className="bg-gray-900 p-4 rounded-xl shadow-lg hover:scale-[1.023] transition-all duration-200 flex justify-between items-start border border-gray-700"
          >
            <div className="space-y-1">
              <p className="text-white text-lg font-medium">
                Name: <span className="text-gray-300">{pass.name}</span>
              </p>
              <p className="text-white text-lg font-medium">
                Password: <span className="text-gray-300">{pass.password}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                className="bg-violet-500 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition duration-150 shadow"
                onClick={(e) => handleAccountDelete(e, pass._id)}
              >
                Delete
              </button>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-md transition duration-150 shadow"
                onClick={(e) => handleView(e, pass._id)}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};