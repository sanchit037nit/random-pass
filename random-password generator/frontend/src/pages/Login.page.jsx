import { useState } from "react";
import {useAuthStore} from "../store/useauthstore.js"
import { toast } from "react-hot-toast";
import { usePasStore } from "../store/usepasstore.js";

export const Loginpage = () =>{

    const {login} =useAuthStore()
    const [formdata,setformdata] = useState({
        email:"",
        pass:"",
    })

    const handleclick = (e)=>{
        e.preventDefault()
        if(!formdata.email || !formdata.pass){
            return toast.error("all fields required")
        }
        login(formdata)
    }
     return (

   
        <form onSubmit={handleclick} className="space-y-7 text-white w-full max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
  <h2 className="text-center text-2xl font-bold mb-4">Login Form</h2>

  <div className="flex flex-col space-y-2">
    <label htmlFor="email" className="text-lg">Enter your Email</label>
    <input 
      type="email"
      id="email"
      className="border border-gray-400 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter your email"
      value={formdata.email}
      onChange={(e) => setformdata({ ...formdata, email: e.target.value })}
      required
    />
  </div>

  <div className="flex flex-col space-y-2">
    <label htmlFor="password" className="text-lg">Enter your Password</label>
    <input 
      type="password"
      id="password"
      className="border border-gray-400 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter your password"
      value={formdata.pass}
      onChange={(e) => setformdata({ ...formdata, pass: e.target.value })}
      required
    />
  </div>

  <button 
    type="submit" 
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
  >
    Submit
  </button>
</form>

    );

}