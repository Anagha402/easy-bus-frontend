import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/commonAPI';
import { Form, message } from 'antd';

function OtpVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = new URLSearchParams(location.search).get("email");

    const [otp, setOtp] = useState("");

    const verifyOtp = async () => {
        try {
            const response = await api.post('/api/users/verify-otp', { email, otp });

            if (response.data.success) {
                message.success(response.data.message);
                navigate('/login');  
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error("Error verifying OTP");
        }
    };

    return (
        <div className="otp-container " style={{height:"100vh", backgroundColor:"rgba(193, 3, 66, 0.35)"}}>
            
            <h3 className='text-center p-4'>Enter OTP sent to your email used for registration</h3>
            <h5 className='text-center'>OTP valid only for 10 minutes</h5>
            <Form onFinish={verifyOtp}>
                <input className='w-5 form-control mt-5' style={{width:"200px", marginLeft:"660px"}}
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                />
                <button type="submit" className='btn btn-primary mt-5'style={{marginLeft:"700px"}}>Verify OTP</button>
            </Form>

            
           
        </div>
    );
}

export default OtpVerification;
