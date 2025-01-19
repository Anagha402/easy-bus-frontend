import React from 'react'
import { Form, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/commonAPI'  // Import the Axios instance
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import {ShowLoading, HideLoading} from '../Redux/alertSlice'






function Login() {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const onFinish=async(values)=>{

        console.log(values);
        try {
          dispatch(ShowLoading())
            const response = await api.post("/api/users/login", values);  // Making the POST request to the backend
            dispatch(HideLoading())
            
            if (response.data.success) {
              message.success("Logged in successfully");
              sessionStorage.setItem("token",response.data.data)

              


              navigate('/')
            } else {
              toast.warning(response.data.message);
            }
          } catch (error) {
            dispatch(HideLoading())
            toast.warning(error.message);  // Display error if request fails
          }
        
    }
  return (
    <>
    
    <div className="h-screen d-flex justify-content-center align-items-center  " style={{backgroundColor:"rgb(190, 9, 69)"}}>
        
        <div className="w-400 card  ">
           
        <Form layout='vertical' className='border p-5' onFinish={onFinish}>
        <h4 className='mb-4  '>Easy Bus - Login</h4>
        <hr />
        
   
        
    

    <Form.Item label="Email" name='email'>
        <input type="email" />
        
    </Form.Item>

    <Form.Item label="Password" name='password'>
        <input type="password" />
        
    </Form.Item>

    
          <div className="d-flex justify-content-between">
            <p>Click here to <Link  to={'/register'} className='text-decoration-none text-success'> Register</Link> </p>
            
          <button className='btn btn-primary' type="submit">Login</button>

          </div>
    
    </Form>
    
        </div>
    

    </div>
    
   <ToastContainer position="top-center" autoClose={2000} theme="colored" />  
      
    </>
  )
}

export default Login

