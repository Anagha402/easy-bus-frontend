import React from 'react'
import { Form, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import api from '../services/commonAPI'  // Import the Axios instance
import { useDispatch } from 'react-redux';
import {ShowLoading, HideLoading} from '../Redux/alertSlice'
import { ToastContainer, toast } from 'react-toastify';





function Register() {
  const navigate=useNavigate()
  const dispatch=useDispatch()


// const onFinish = async (values) => {
//         try {
//           dispatch(ShowLoading())
//           const response = await api.post("/api/users/register", values);  // Making the POST request to the backend
//           dispatch(HideLoading())
//           if (response.data.success) {
//             message.success(response.data.message);
//             navigate('/login')

//           } else {
//             toast.warning(response.data.message);
//           }
//         } catch (error) {
//           dispatch(HideLoading())
//           toast.warning(error.message);  // Display error if request fails
//         }
//       };
const onFinish = async (values) => {
  try {
      dispatch(ShowLoading());
      const response = await api.post("/api/users/register", values);
      dispatch(HideLoading());

      if (response.data.success) {
          message.success(response.data.message);
          navigate(`/otp-verification?email=${values.email}`);  // Navigate to OTP page
      } else {
          toast.warning(response.data.message);
      }
  } catch (error) {
      dispatch(HideLoading());
      toast.warning(error.message);
  }
};
  
  return (
    <>
    <div className="h-screen d-flex justify-content-center align-items-center" style={{backgroundColor:"rgb(190, 9, 69)"}}>
        
        <div className="w-400 card  ">
           
        <Form layout='vertical' className='border p-5' onFinish={onFinish}>
        <h4 className='mb-4  '>Easy Bus - Register</h4>
        <hr />
        
    <Form.Item label="Name" name='name' >
        <input type="text"  />
        
    </Form.Item>

    <Form.Item label="Email" name='email'>
        <input type="email" />
        
    </Form.Item>

    <Form.Item label="Password" name='password'>
        <input type="password" />
        
    </Form.Item>

    
          <div className="d-flex justify-content-between">
            <p>Click here to <Link  to={'/login'} className='text-decoration-none text-success'> Login</Link> </p>
            
          <button className='btn btn-primary' type="submit">Register</button>

          </div>
    
    </Form>
    
        </div>
    

    </div>
    <ToastContainer position="top-center" autoClose={2000} theme="colored" />  
    
    
    </>
  )
}

export default Register

