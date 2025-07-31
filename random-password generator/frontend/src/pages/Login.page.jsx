import { useState } from "react";
import {useAuthStore} from "../store/useauthstore.js"
import { toast } from "react-hot-toast";
import { usePasStore } from "../store/usepasstore.js";
import { useNavigate } from "react-router-dom";
import '@splinetool/viewer'; 

export const Loginpage = () =>{

    const {login} =useAuthStore()
    const [formdata,setformdata] = useState({
        emailid:"",
        password:"",
    })
   

    const handleclick = (e)=>{
        e.preventDefault()
        if(!formdata.emailid || !formdata.password){
            return toast.error("all fields required")
        }
        login(formdata)
    }

     const navigate = useNavigate();
    const handlecross = (e) => {
    e.preventDefault();
    navigate('/');
   }

     return (

       <div className="flex justify-center items-center min-h-screen ">
           <spline-viewer
        url="https://prod.spline.design/cwq814qIdbhTkjqB/scene.splinecode"
        background="transparent"
        class="absolute top-0 left-0 w-full h-full z-[-1]"
      ></spline-viewer>

        <form onSubmit={handleclick} className="space-y-7 text-white w-full max-w-md mx-auto  p-8 rounded-lg shadow-lg">
       
       <div className="flex justify-between items-center mb-6">
       <h2 className="text-center text-2xl font-bold mb-4">Login Form</h2>
       <div className="flex items-center justify-center w-7 h-7 bg-gray-100 rounded-full hover:bg-red-50 transition-colors duration-200">
  <button 
    onClick={handlecross}
    className="text-sm leading-none text-gray-600 hover:text-red-600 focus:outline-none"
  >
    ❌
  </button>
</div>
</div>
  <div className="flex flex-col space-y-2 ">
    <label htmlFor="email" className="text-lg">Enter your Email</label>
    <input 
      type="email"
      id="email"
      className="border border-gray-400 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter your email"
      value={formdata.emailid}
      onChange={(e) => setformdata({ ...formdata, emailid: e.target.value })}
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
      value={formdata.password}
      onChange={(e) => setformdata({ ...formdata, password: e.target.value })}
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
</div>
    );

}