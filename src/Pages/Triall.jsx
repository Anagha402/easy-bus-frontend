import React, { useState } from 'react';
import { Form, message } from 'antd';
import { Link } from 'react-router-dom';
import api from '../services/commonAPI';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../Redux/alertSlice';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

function Login() {
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const onFinish = async (values) => {
    console.log(values);
    try {
      dispatch(ShowLoading());
      const response = await api.post('/api/users/login', values);
      dispatch(HideLoading());

      if (response.data.success) {
        message.success('Logged in successfully');
        sessionStorage.setItem('token', response.data.data);
        window.location.href = '/';
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
      <div
        className="h-screen d-flex justify-content-center align-items-center"
        style={{ backgroundColor: 'rgba(165, 18, 70, 0.37)' }}
      >
        <div className="w-400 card">
          <Form layout="vertical" className="border p-5" onFinish={onFinish}>
            <h4 className="mb-4">Easy Bus - Login</h4>
            <hr />

            {/* Email Input with Required Validation */}
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Email is required' }]}
            >
              <input className="form-control" type="email" />
            </Form.Item>

            {/* Password Input with Toggle Visibility */}
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <div className="input-group">
                <input
                  className="form-control"
                  type={passwordVisible ? 'text' : 'password'}
                />
                <span
                  className="input-group-text"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: 'pointer' }}
                >
                  {passwordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              </div>
            </Form.Item>

            <div className="d-flex justify-content-between">
              <p className="mt-3">
                Click here to{' '}
                <Link to={'/register'} className="text-decoration-none text-success">
                  Register
                </Link>
              </p>
              <button className="btn btn-primary m-3" type="submit">
                Login
              </button>
            </div>
          </Form>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </>
  );
}

export default Login;
