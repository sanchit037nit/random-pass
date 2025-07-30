import React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react'
import { useAuthStore } from '../store/useauthstore.js'
import { useNavigate } from 'react-router-dom';
import { usePasStore } from '../store/usepasstore.js';
import Navbar from '../components/Navbar.jsx';

export const Ranpass = () => {
 
  const Navigate = useNavigate();
 const [length, setLength] = useState(8)
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false)
  const [password, setPassword] = useState("")
 const {logout} = useAuthStore()
 const { setGeneratedPassword } = usePasStore();



  //useRef hook
  const passwordRef = useRef(null)

  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = ""
 

    if (numberAllowed) str +="0123456789"
    if (charAllowed) str += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*-_+=[]{}~`"
    if (charAllowed && numberAllowed) str += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-_+=[]{}~`"

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1)
      pass += str.charAt(char)
      
    }

    setPassword(pass)
    setGeneratedPassword(pass);

  }, [length, numberAllowed, charAllowed, setPassword])

  const copyPasswordToClipboard = useCallback(() => {
    
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 999);
    window.navigator.clipboard.writeText(password)
  }, [password])

  useEffect(() => {
    passwordGenerator()
  }, [length, numberAllowed, charAllowed, passwordGenerator])

      const handleclick=(e)=>{
      e.preventDefault()
       logout()
    }

  return (
    
    <div className='flex flex-col justify-center bg-gray-800  text-white font-sans tracking-wide'>
      <div>
      <Navbar/>
     </div>
    <div className=" flex flex-col justify-evenly items-center w-150 h-148 mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-blue-400 text-blue-800 font-bold ">
      <div className='flex justify-around w-full'>
      <h1 className='text-black text-center my-3 text-3xl'>Password generator</h1>
 
    </div>
    <div className="  h-15 flex  items-center shadow rounded-lg overflow-hidden mb-4 bg-white justify-center w-110">
        <input
            type="text"
            value={password}
            className="outline-none w-full py-1 px-3 text-xl"
            placeholder="Password"
            readOnly
            ref={passwordRef}
          
        />
        <button
        onClick={copyPasswordToClipboard}
        className=' h-8 outline-none hover:bg-green-400 hover:scale-105 bg-blue-700 text-white px-3 py-0.5 shrink-0 m-0.5 rounded-2xl'
        >copy</button>

        <button
         onClick={()=>Navigate("/create")}
        className=' h-8 outline-none hover:bg-green-400 hover:scale-105 bg-blue-800 text-white px-3 py-0.5 shrink-0 m-0.5 rounded-2xl justify-items-center'
        >save</button>
        
    </div>
    <div className='flex text-sm gap-x-2'>
      <div className='flex items-center gap-x-1'>
        <input 
        type="range"
        min={6}
        max={20}
        value={length}
         className='cursor-pointer '
         onChange={(e) => {setLength(e.target.value)}}
          />
          <label className='text-xl'>Length: {length}</label>
      </div>
      <div className="flex items-center gap-x-1">
      <input
          type="checkbox"
          defaultChecked={numberAllowed}
          id="numberInput"
          onChange={() => {
              setNumberAllowed((prev) => !prev);  //prev important
          }}
      />
      <label htmlFor="numberInput" className='text-xl'>Numbers</label>
      </div>
      <div className="flex items-center gap-x-1">
          <input
              type="checkbox"
              defaultChecked={charAllowed}
              id="characterInput"
              onChange={() => {
                  setCharAllowed((prev) => !prev )
              }}
          />
          <label htmlFor="characterInput" className='text-xl'>Characters</label>
      </div>
    </div>
    
    <div className='text-xl flex justify-evenly  items-center m-5 bg-gray-200 rounded-lg p-2 w-130 h-10 hover:bg-green-500'>
        <button onClick={()=>Navigate("/home")}>Your Passwords</button>
    </div>
  
 </div>
    </div>
  )
}