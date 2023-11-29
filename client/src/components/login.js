import appLogo from '../assets/logo.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import password from '../.passwords';

const Login = () => {
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [inValidEmailError, setInValidEmailError] = useState("");
    const navigate = useNavigate();

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${password.emailValidationAPIKey}&email=${email}`)
            .then(response => {
                if (response.data.deliverability === "UNDELIVERABLE") {
                    setIsValidEmail(false);
                    if (response.data.autocorrect !== "") {
                        setInValidEmailError(`Did you mean ${response.data.autocorrect}?? Please correct and submit again!`)
                    }
                    else if (!response.data.is_valid_format.value) {
                        setInValidEmailError(`Invalid email format!`)
                    }
                    else {
                        setInValidEmailError(`Email does not exist!`)
                    }
                }
                else if (response.data.deliverability === "DELIVERABLE"){
                    localStorage.setItem('userEmail', email);
                    navigate('/dashboard');
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div className="flex flex-row h-full w-full">
            <div className="basis-4/6 bg-teal-600 flex flex-row items-center justify-center gap-10">
                <img src={appLogo} alt="SSL Monitor Logo" className='w-44 h-48 rounded-lg'/>
                <p className="text-white text-5xl text-left" style={{ lineHeight: '1.5' }}>SSL Certificate Monitor:
                <br />
                Vigilantly Monitoring Expiry,
                <br />
                Promptly Notifying You!
                </p>
            </div>
            <div className="basis-2/6 flex flex-col items-center justify-center pl-10 pr-28 gap-6">
                <span className='text-2xl text-teal-900 font-semibold w-full'>Login to your dashboard</span>
                <div className='w-full'>
                    <form
                        id="email-form"
                        className="flex flex-row justify-between border-2 rounded border-teal-500 border-solid focus-within:border-teal-600">
                        <input
                            type="email" id="email" name="email"
                            placeholder="Enter your email address"
                            className='outline-0 w-10/12 p-2'
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setIsValidEmail(true);
                            }}
                            required
                        />
                        <button
                            type="submit" id="submit"
                            className='w-2/12 bg-teal-500 flex items-center justify-center text-white hover:bg-teal-600'
                            onClick={handleEmailSubmit}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>              
                    </form>
                    {!isValidEmail && (
                        <p className='text-red-500 text-sm'>{inValidEmailError}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Login;