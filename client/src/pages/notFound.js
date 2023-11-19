import React, { useState, useEffect  } from 'react';
import appLogo from '../assets/logo.png';

const NotFound = () => {

    return (
        <div className="bg-teal-50 h-full w-full items-center justify-center flex flex-col gap-10">
            <div className="shadow-xl shadow-teal-100 h-20 w-20">
                <img src={appLogo} alt="SSL Monitor Logo" />
            </div>
            <div>
                <p className="text-4xl font-bold text-teal-700">Oops! Page Not Found :(</p>
            </div>
        </div>
    )
}

export default NotFound;