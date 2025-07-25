import React from 'react' 
import { useAuthStore } from '../store/useauthstore.js'
import { usePasStore } from '../store/usepasstore.js'  
import { useEffect } from 'react'

export const   Homepage=  () => {
    const {authUser,logout} = useAuthStore()
    const {getpass ,passes,viewpass} = usePasStore()
    console.log(passes)
    const id=authUser._id
 
    useEffect(() => {
    getpass(id);
    }, [id]);

    const handleclick=(e)=>{
      e.preventDefault()
       logout()
    }

 
    const handledelete=(e)=>{
      e.preventDefault()
       logout()
    }

    const handleview=(e,id)=>{
      e.preventDefault()
        viewpass(id)
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


<div className="space-y-4 ">
  {passes?.map((pass) => (
    <div
      key={pass._id}
      className="bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-[1.023] transition-transform duration-200 flex justify-between items-center"
    >
      <div>
        <p className="text-white font-semibold">Name: <span className="font-normal">{pass.name}</span></p>
        <p className="text-white font-semibold">Password: <span className="font-normal">{pass.password}</span></p>
      </div>
      
      <div className="flex gap-3" >
        <button className="bg-violet-300 hover:bg-violet-600 text-black px-3 py-1 rounded shadow">
          Delete
        </button>
        
        <button className="bg-amber-500 hover:bg-amber-600 text-black px-3 py-1 rounded shadow" onClick={(e) => handleview(e, pass._id)}>
          View
        </button>
      </div>
    </div>
  ))}
</div>
 </div>
  )
}

// export default Homepage
