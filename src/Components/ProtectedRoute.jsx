import React, {  useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/commonAPI'  // Import the Axios instance
import { ToastContainer, toast } from 'react-toastify';
import { SetUser } from '../Redux/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {ShowLoading, HideLoading} from '../Redux/alertSlice'
import DefaultLayout from './DefaultLayout';
import { message } from 'antd';

function ProtectedRoute({children}) {
  const dispatch=useDispatch()
  const {user}= useSelector(state=>state.users)
  //const{loading}=useSelector(state=>state.alerts)
  //const[loading,setLoading]=useState(true)
  const navigate=useNavigate()
  const validateToken=async()=>{
    //api call
    try{
      dispatch(ShowLoading())
      const response=await  api.post("/api/users/get-user-by-id", {},{
        headers:{
          Authorization:`Bearer ${sessionStorage.getItem("token")}`
        }
      });
      dispatch(HideLoading())

      if(response.data.success){
        
        
        dispatch(SetUser(response.data.data))
      }else{
        
        sessionStorage.removeItem('token')
        toast.warning(response.data.message)
      
        navigate('/home')
      }

    }catch(error){
      dispatch(HideLoading())
      sessionStorage.removeItem('token')
      
      toast.warning(response.data.message)
      
      navigate('/home')

    }

  }
  useEffect(()=>{
    if(sessionStorage.getItem("token")){
      validateToken()

    }else{
      navigate('/home')

    }
  },[])
  return (
    <>
    <div>
      {user && <DefaultLayout>{children}</DefaultLayout>}
    </div>
    
     <ToastContainer position="top-center" autoClose={2000} theme="colored" />  
    </>
  )
}

export default ProtectedRoute
