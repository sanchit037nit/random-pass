import React, { act } from 'react'
import {useNavigate} from 'react-router-dom'
import { useAuthStore } from '../store/useauthstore.js'
import { usePasStore } from '../store/usepasstore.js';

const Navbar = () => {
   const navigate= useNavigate();
//    const authUser=useAuthStore((state)=>state.authUser)
    const {authUser, logout, deleteaccount} = useAuthStore();
   

    const handleLogout = (e) => {
    e.preventDefault();
    logout();
    };

  const handleAccountDelete = (e) => {
    e.preventDefault();
    deleteaccount();
   };



   const navitems=[
    {
        title: "Home",
        action: () => navigate("/ranpass"),
        user:true
    },
    {
        title: "Login",
        path: "/login",
        user:false
    },
    {
        title: "Signup",
        path: "/signup",
        user:false
    },
    {
        title: "Logout",
        action: handleLogout,
        user:true
    },
    {
        title: "Delete Account",
        action: handleAccountDelete,
        user:true
    }
   ]
  return (
  
    <div className='flex flex-wrap justify-between items-center  px-8 py-5 text-white shadow-md'>
  {/* Logo & Title */}
  <div className='flex items-center gap-2'>
    <span className='text-2xl font-extrabold tracking-wide text-amber-400'>🔐</span>
    <h1 className='text-2xl font-bold'>PASSGEN</h1>
  </div>

  {/* Navigation Buttons */}
  <div className='flex gap-4 flex-wrap'>
    {authUser
      ? navitems.filter(item => item.user).map(item => (
          <button
            key={item.title}
            onClick={item.action}
            className='px-4 py-2 rounded hover:bg-amber-400 hover:text-gray-900 transition-colors duration-300'
          >
            {item.title}
          </button>
        ))
      : navitems.filter(item => !item.user).map(item => (
          <button
            key={item.title}
            onClick={() => navigate(item.path)}
            className='px-4 py-2 rounded hover:bg-amber-400 hover:text-gray-900 transition-colors duration-300'
          >
            {item.title}
          </button>
        ))}
  </div>
</div>
  )
}

export default Navbar
