import { useState, useEffect } from 'react';
import axios from 'axios';
import appLogo from '../../assets/logo.png';
import TableView from './tableView/tableView';
import CalendarView from './calendarView/calendarView';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [userData, setUserData] = useState([]);
    const [userDataError, setUserDataError] = useState('');
    const [isHomePage, setIsHomePage] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {       
        console.log("in dashboard useeffect")
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/get-domains-list?userEmail=${localStorage.getItem("userEmail")}`);
                setUserData(response.data);
                setUserDataError('');
            } catch (err) {
                setUserDataError(err.response?.data?.error || 'An unexpected error occurred!');
                setUserData([]);
            }
        };
        fetchData();
    }, []);

    const handleNewRowData = (newRowData) => {
        setUserData([
            ...userData,
            newRowData
        ]);
    }

    const handleDeleteRowData = (deletionRowsSelected) => {
        const dataAfterDeletion = userData.filter(item => !deletionRowsSelected.includes(item._id));
        setUserData(dataAfterDeletion);
    }

    const handleRefreshRowData = (updatedRecords) => {
        const updatedRowData = userData.map(row => {
            const updatedRow = updatedRecords.find(updated => updated._id === row._id);
            return updatedRow ? { ...row, ...updatedRow } : row;
        });
        setUserData(updatedRowData);
    }

    const handleSetHomePage = () => {
        setIsHomePage(true);
    }

    const handleSetCalendarView = () => {
        setIsHomePage(false);
    }

    const handleLogOut = () => {
        localStorage.removeItem('userEmail');
        navigate('/');
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-row basis-1/12 bg-teal-600 justify-between px-4">
                <div className="flex flex-row gap-4 items-center">
                    <img src={appLogo} alt="SSL Monitor Logo" className='w-11 h-11 rounded-md'/>
                    <span className='text-2xl text-white font-semibold'>SSL Certificate Monitor</span>   
                </div>
                <div className='flex items-center'>
                    <button
                        className='bg-red-500 py-2 px-3 text-white rounded-lg outline-0 hover:bg-red-600'
                        onClick={handleLogOut}>LOG OUT</button>
                </div>
            </div>
            <div className='flex basis-11/12 flex-row'>
                <div className='flex flex-col basis-1/5 border-r-2 border-teal-50 bg-teal-50 py-5 px-3 gap-1'>
                    <button
                        className={`flex flex-row w-full gap-2 items-center hover:bg-teal-100 focus:bg-teal-100 pl-6 py-3 rounded-2xl outline-none ${
                            isHomePage ? 'bg-teal-100' : ''}`}
                        autoFocus={true}
                        onClick={handleSetHomePage}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(17 94 89)" className="w-8 h-8">
                            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                        </svg>
                        <span className="text-xl text-teal-800 font-semibold">Home</span>
                    </button>
                    <button
                        className={`flex flex-row w-full gap-2 items-center hover:bg-teal-100 focus:bg-teal-100 pl-6 py-3 rounded-2xl outline-none ${
                            isHomePage ? '' : 'bg-teal-100'}`}
                        onClick={handleSetCalendarView}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(17 94 89)" className="w-8 h-8">
                            <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xl text-teal-800 font-semibold">Calendar View</span>
                    </button>
                </div>
                <div className='flex basis-4/5 bg-teal-50 p-5'>
                    {!userDataError && isHomePage && (
                        <TableView
                            rowData={userData}
                            handleNewRowData={handleNewRowData}
                            handleDeleteRowData={handleDeleteRowData}
                            handleRefreshRowData={handleRefreshRowData}/>
                    )}

                    {!userDataError && !isHomePage &&(
                        <CalendarView
                            calendarData={userData}/>
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