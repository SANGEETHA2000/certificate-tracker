import { Dialog } from "@mui/material";
import appLogo from '../../../assets/logo.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import password from '../../../.passwords';
import Loader from "../../../pages/loader";

const Login = ({handleCloseLoginDialog, isLoginDialogOpen}) => {
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [inValidEmailError, setInValidEmailError] = useState("");
    const [openLoader, setOpenLoader] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setOpenLoader(true);
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
        setOpenLoader(false);
    };

    return (
        <>
            <Dialog open={isLoginDialogOpen} onClose={handleCloseLoginDialog} fullWidth={true}>
                <div className="flex flex-col p-6 gap-10 pb-12">
                    <img src={appLogo} alt="Certrac Logo" className='h-8 w-32'/>
                    <div className="basis-2/6 flex flex-col items-center justify-center gap-6">
                        <span className='text-2xl text-teal-900 font-semibold w-full'>Login to start monitoring</span>
                        <div className='w-full'>
                            <form
                                id="email-form"
                                className="flex flex-row justify-between border-2 rounded border-teal-500 border-solid focus-within:border-teal-600">
                                <input
                                    type="email" id="email" name="email"
                                    placeholder="Enter your email address"
                                    className='outline-0 w-10/12 sm:w-11/12 p-2'
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setIsValidEmail(true);
                                    }}
                                    required
                                />
                                <button
                                    type="submit" id="submit"
                                    className='w-2/12 sm:w-1/12 bg-teal-500 flex items-center justify-center text-white hover:bg-teal-600'
                                    onClick={handleEmailSubmit}>
                                    <svg xmlns="http:   ww.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>              
                            </form>
                            {!isValidEmail && (
                                <p className='text-red-500 text-sm pt-3'>{inValidEmailError}</p>
                            )}
                        </div>
                    </div>
                </div>
            </Dialog>
            {openLoader && 
                <Loader openLoader={openLoader} />
            }
        </>
    )
}

export default Login;