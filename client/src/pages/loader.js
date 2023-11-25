import React, { useState, useEffect  } from 'react';
import appLogo from '../assets/logo.png';

const Loading = () => {

    const [dots, setDots] = useState('');

    useEffect(() => {
        console.log("loader use effect")
        const intervalId = setInterval(() => {
            setDots((prevDots) => {
                if (prevDots.length === 3) {
                  return '.';
                }
                return prevDots + '.';
            });
        }, 400);
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run the effect only once on mount

    return (
        <div className="bg-white h-full w-full items-center justify-center flex flex-col">
            <div className="shadow-xl shadow-teal-100 h-16 w-16">
                <img src={appLogo} alt="SSL Monitor Logo" />
            </div>
            <div>
                <p className="text-4xl font-bold text-teal-300">{dots}</p>
            </div>
        </div>
    )
}

export default Loading;