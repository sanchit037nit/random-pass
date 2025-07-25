import React from 'react' 
import { useAuthStore } from '../store/useauthstore.js'
import { usePasStore } from '../store/usepasstore.js'  
import { useEffect } from 'react'

export const   Homepage=  () => {
    const {authUser,logout} = useAuthStore()
    const {getpass ,passes} = usePasStore()
    console.log(passes)
    const id=authUser._id
 
    useEffect(() => {
    getpass(id);
    }, [id]);

    const handleclick=(e)=>{
      e.preventDefault()
       logout()
    }
  return (

    <div className="p-6 bg-gray-800 min-h-screen">
      <span>
        <div className="  flex justify-between">
    <div className="text-white text-2xl font-bold mb-4 underline flex justify-between">MY PASSWORDS   </div>
     <div className="flex justify-end mb-4 p-2 bg-gray-800 rounded text-white">
  <button
    onClick={handleclick}
    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
  >
    Logout
  </button>
</div>

    </div>


 
  </span>
  <div className="space-y-4">
    {passes?.map((pass) => (
      <div
        key={pass._id}
        className="bg-gray-700 p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
      >
        <p className="text-white font-semibold">Name: <span className="font-normal">{pass.name}</span></p>
        <p className="text-white font-semibold">Password: <span className="font-normal">{pass.password}</span></p>
      </div>
    ))}
  </div>
  </div>

  )
}

// export default Homepage
