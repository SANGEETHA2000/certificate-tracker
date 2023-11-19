import { useState, useEffect } from 'react';
import axios from 'axios';
import appLogo from '../../assets/logo.png';
import TableViewComponent from './tableView/tableView';


const Dashboard = () => {
    const [userData, setUserData] = useState([]);
    const [userDataError, setUserDataError] = useState('');
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/getDomainList?userEmail=${localStorage.getItem("userEmail")}`);
                setUserData(response.data);
                setUserDataError('');
            } catch (err) {
                setUserDataError(err.response?.data?.error || 'An unexpected error occurred!');
                setUserData([]);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setUserData
    }, [userData]);

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-row basis-1/12 bg-teal-600 justify-between px-4">
                <div className="flex flex-row gap-4 items-center">
                    <img src={appLogo} alt="SSL Monitor Logo" className='w-11 h-11 rounded-md'/>
                    <span className='text-2xl text-white font-semibold'>SSL Certificate Monitor</span>   
                </div>
                <div className='flex items-center'>
                    <button className='bg-red-500 py-2 px-3 text-white rounded-lg outline-0 hover:bg-red-600'>LOG OUT</button>
                </div>
            </div>
            <div className='flex basis-11/12 flex-row'>
                <div className='flex basis-1/5 border-r-2 border-teal-50'>

                </div>
                <div className='flex basis-4/5 bg-teal-50 p-5'>
                    {!userDataError && (
                        <TableViewComponent rowData={userData} />
                    )}
                    {userDataError && (
                        <div className='flex flex-col items-center justify-center gap-6 pb-5 h-full w-full'>
                            <p className='text-red-700 text-2xl'>{userDataError}</p>
                            {/* <button
                                className='bg-red-500 py-2 px-3 text-white rounded-lg outline-0 hover:bg-red-600'
                                onClick={handleClose}
                            >Close</button> */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard;