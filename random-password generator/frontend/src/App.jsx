import { useState, useCallback, useEffect, useRef } from 'react'
import { Ranpass } from './components/Ranpass'
import { Routes,Route, Navigate } from 'react-router-dom'
import { Signuppage } from './pages/Signup.page'
import { Toaster } from 'react-hot-toast'
import { Loginpage } from './pages/Login.page'
import { Firstpage } from './pages/First.page'
import  {Homepage}  from './pages/Homepage'
import Createpage from './pages/Createpage'
import './App.css'
import { useAuthStore } from './store/useauthstore.js'
import ViewPage from './pages/Viewpage.jsx'


const App=()=>{
  const { authUser ,checkauth} = useAuthStore()

  useEffect(()=>{
    checkauth()
  },[checkauth]);

    // console.log( authUser)
  return (
    <div>
    <Routes>
      <Route path="/" element={<Firstpage />} />
      <Route path="/signup" element={!authUser ?<Signuppage /> : <Navigate to="/ranpass" />} />
      <Route path="/login" element={!authUser ? <Loginpage /> : <Navigate to="/ranpass" />} />
      <Route path="/ranpass" element={authUser ? <Ranpass /> : <Navigate to="/" />} />
      <Route path="/home" element={authUser ? <Homepage /> : <Navigate to="/" />} />
      <Route path="/create" element={authUser ? <Createpage /> : <Navigate to="/" />} />
      <Route path="/view" element={authUser ? <ViewPage /> : <Navigate to="/" />} />
   
    </Routes>

    <Toaster />
    </div>
  )
}

export default App

