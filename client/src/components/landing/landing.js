import appLogo from '../../assets/logo.png';
import React, { useState } from 'react';
import Login from './login/login';

const Landing = () => {
    
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

    const handleOpenLoginDialog = () => {
        setIsLoginDialogOpen(true);
    }

    const handleCloseLoginDialog = () => {
        setIsLoginDialogOpen(false);
    }

    return (
        <div className='flex flex-col h-full w-full bg-gradient-to-b from-white via-teal-50 to-teal-100 px-6 md:px-10 lg:px-16 py-10 gap-10 md:gap-0'>
            <div className='flex items-center justify-between'>
                <img src={appLogo} alt="SSL Monitor Logo" className='h-8 w-32'/>
                <button
                    className='bg-teal-500 py-2 px-4 text-white text-sm md:text-lg font-medium rounded-full outline-0 hover:bg-teal-600'
                    onClick={handleOpenLoginDialog}
                >Start Monitoring</button>
            </div>
            <div className='flex flex-col md:flex-row md:h-full md:py-4 md:items-center gap-5 md:gap-2'>
                <div className='flex flex-col gap-5 md:gap-10 md:w-1/2'>
                    <div className='flex flex-col text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-teal-900 font-bold'>
                        <span>Vigilantly Monitoring,</span>
                        <span>Promptly Notifying!</span>
                    </div>
                    <div className='flex flex-col text-md lg:text-lg xl:text-xl 2xl:text-2xl text-teal-900 font-base'>
                        <span>
                            Monitor all your SSL certificates in one place. Get notified well before expiry and avoid website downtime. 
                        </span>
                    </div>
                    <button
                        className='w-fit bg-teal-500 py-2 px-4 text-white text-sm md:text-lg font-medium rounded-full outline-0 hover:bg-teal-600'
                    >How it works?</button>
                </div>
                <div className='flex md:h-full md:w-1/2 items-center justify-center bg-white border'>
                    <span className=''>Screenshot</span>
                </div>
            </div>
            {isLoginDialogOpen &&
                <Login
                    isLoginDialogOpen={isLoginDialogOpen}
                    handleCloseLoginDialog={handleCloseLoginDialog}
                />
            }
        </div>
    )
}

export default Landing;