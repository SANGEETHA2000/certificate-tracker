import { Dialog } from "@mui/material";
import appLogo from '../../../assets/logo.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from "../../../pages/loader";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = ({handleCloseLoginDialog, isLoginDialogOpen}) => {
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [inValidEmailError, setInValidEmailError] = useState("");
    const [openLoader, setOpenLoader] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarSeverity, setSnackBarSeverity] = useState('');
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const navigate = useNavigate();

    const handleCloseSnackBar = () => {
        setOpenSnackBar(false);
        setSnackBarMessage('');
        setSnackBarSeverity('');
    }

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setOpenLoader(true);
        axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.REACT_APP_EMAIL_VALIDATION_API_KEY}&email=${email}`)
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
                setOpenLoader(false);
            })
            .catch(error => {
                setSnackBarMessage("Error in validating email!");
                setOpenSnackBar(true);
                setSnackBarSeverity('error');
                setOpenLoader(false);
            });
    };

    return (
        <Dialog open={isLoginDialogOpen} onClose={handleCloseLoginDialog} fullWidth={true}>
            <div className="flex flex-col p-4 md:p-6 gap-6 md:gap-10 pb-8 md:pb-12">
                <img src={appLogo} alt="Certrac Logo" className='h-7 w-28 md:h-8 md:w-32'/>
                <div className="basis-2/6 flex flex-col items-center justify-center gap-6">
                    <span className='text-lg md:text-2xl text-teal-900 font-semibold w-full'>Login to start monitoring</span>
                    <div className='w-full'>
                        <form
                            id="email-form"
                            className="flex flex-row justify-between border-2 rounded border-teal-500 border-solid focus-within:border-teal-600">
                            <input
                                type="email" id="email" name="email"
                                placeholder="Enter your email address"
                                className='outline-0 w-10/12 sm:w-11/12 p-1 md:p-2 text-sm md:text-base'
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
            {openLoader && 
                <Loader openLoader={openLoader} />
            }
            {snackBarMessage && (
                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={5000}
                    anchorOrigin={{ vertical: 'bottom', horizontal:'right' }}
                    onClose={handleCloseSnackBar}>
                    <Alert onClose={handleCloseSnackBar} severity={snackBarSeverity} sx={{ width: '100%' }}>
                        {snackBarMessage}
                    </Alert>
                </Snackbar>
            )}
        </Dialog>
    )
}

export default Login;