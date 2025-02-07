import React, { useState } from 'react';
import { Form, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/commonAPI';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../Redux/alertSlice';
import { ToastContainer } from 'react-toastify';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  const onFinish = async (values) => {
    try {
      if (values.password !== values.confirmPassword) {
        message.error("Passwords do not match!");
        return;
      }
  
      console.log("Submitting:", values); // Debugging line
  
      dispatch(ShowLoading());
      const response = await api.post("/api/users/register", values);
      dispatch(HideLoading());
  
      console.log("Response:", response.data); // Debugging line
  
      if (response.data.success) {
        message.success(response.data.message);
        navigate(`/otp-verification?email=${values.email}`);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error("Registration failed. Please try again.");
    }
  };
  

  return (
    <>
      <div className="h-screen d-flex justify-content-center align-items-center" style={{ backgroundColor: "rgba(165, 18, 70, 0.37)" }}>
        <div className="w-400 card">
          <Form layout="vertical" className="border p-5" onFinish={onFinish}>
            <h4 className="mb-4">Easy Bus - Register</h4>
            <hr />

            <Form.Item label="Name" name="name" rules={[{ required: true, message: "Name is required" }]}>
              <input className="form-control" type="text" />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ required: true, message: "Email is required" }]}>
              <input className="form-control" type="email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 8, message: "Password must be at least 8 characters" },
                { 
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#]).{8,}$/,
                  message: "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 4 characters long."
                }
              ]}
              
            >
              <div className="input-group">
                <input className="form-control" type={passwordVisible ? "text" : "password"} />
                <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                  {passwordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              </div>
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <div className="input-group">
                <input className="form-control" type={confirmPasswordVisible ? "text" : "password"} />
                <span className="input-group-text" onClick={toggleConfirmPasswordVisibility} style={{ cursor: "pointer" }}>
                  {confirmPasswordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              </div>
            </Form.Item>

            <div className="d-flex justify-content-between mt-3">
              <p>
                Click here to <Link to={'/login'} className="text-decoration-none text-success">Login</Link>
              </p>
              <button className="btn btn-primary" type="submit">Register</button>
            </div>
          </Form>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </>
  );
}

export default Register;
