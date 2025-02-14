import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/commonAPI';
import { Form, message } from 'antd';

function OtpVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = new URLSearchParams(location.search).get("email");

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Allow only numbers

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const verifyOtp = async () => {
        try {
            const enteredOtp = otp.join(""); // Combine OTP inputs
            const response = await api.post('/api/users/verify-otp', { email, otp: enteredOtp });
    
            if (response.data.success) {
                message.success("OTP verified! Your account is now registered.");
                navigate('/login'); // Redirect to login
            } else {
                message.error(response.data.message); // Show OTP error messages
            }
        } catch (error) {
            message.error("Error verifying OTP. Please try again.");
        }
    };
    

    return (
        <div className="otp-container" style={{ height: "100vh", backgroundColor: "rgba(193, 3, 66, 0.35)" }}>
            <h3 className='text-center p-4'>Enter OTP sent to your email used for registration</h3>
            <h5 className='text-center'>OTP valid only for 10 minutes</h5>
            <Form onFinish={verifyOtp} className="text-center">
                <div className="d-flex justify-content-center gap-3 mt-4">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            className="form-control text-center"
                            style={{
                                width: "60px",  
                                height: "60px", 
                                fontSize: "24px", 
                                fontWeight: "bold",
                                textAlign: "center"
                            }}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            ref={(el) => (inputRefs.current[index] = el)}
                        />
                    ))}
                </div>
                <button type="submit" className='btn btn-primary mt-4'>Verify OTP</button>
            </Form>
        </div>
    );
}

export default OtpVerification;
