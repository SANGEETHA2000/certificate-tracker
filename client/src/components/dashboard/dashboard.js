import React, { useState, useEffect } from 'react';
import axios from 'axios';
import appLogo from '../../assets/logo.png';
import tinyAppLogo from '../../assets/tinyLogo.png';
import TableView from './tableView/tableView';
import CalendarView from './calendarView/calendarView';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Logout from '@mui/icons-material/Logout';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Dashboard = () => {
    const [userData, setUserData] = useState([]);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [isHomePage, setIsHomePage] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [dropdown, setDropdown] = useState(null);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarSeverity, setSnackBarSeverity] = useState('');
    const [openLogoutConfirmationDialog, setOpenLogoutConfirmationDialog] = useState(false);
    const open = Boolean(dropdown);
    const navigate = useNavigate();
    const handleProfileDropdown = (event) => {
        setDropdown(event.currentTarget);
    };
    const handleCloseProfileDropdown = () => {
        setDropdown(null);
    };
    
    useEffect(() => {       
        console.log("in dashboard useeffect")
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/get-domains-list?userEmail=${localStorage.getItem("userEmail")}`);
                setUserData(response.data);
                setSnackBarMessage('');
            } catch (err) {
                setSnackBarMessage(err.response?.data?.error || 'Error occurred in fetching domains list! Redirecting to Login Page!');
                setOpenSnackBar(true);
                setSnackBarSeverity('error');
                setUserData([]);
                setTimeout(() => {
                    navigate('/');
                }, 5000)
            }
        };
        fetchData();
        const resizeObserver = new ResizeObserver((entries) => {
            const { width } = entries[0].contentRect;
            setIsSmallScreen(width < 768);
        });
        resizeObserver.observe(window.document.body);
        return () => {
            resizeObserver.disconnect();
        };
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
        setOpenLogoutConfirmationDialog(false);
    }

    const handleCloseSnackBar = () => {
        setOpenSnackBar(false);
        setSnackBarMessage('');
        setSnackBarSeverity('');
    }

    const handleOnLogoutOpenClicked = () => {
        setOpenLogoutConfirmationDialog(true);
    }

    const handleOnLogoutCloseClicked = () => {
        setOpenLogoutConfirmationDialog(false);
    }

    return (
        <div className='flex flex-row w-full h-full'>
            <div className='flex flex-col bg-slate-600 basis-1/6 sm:basis-1/12 md:basis-1/6 p-3 gap-10 items-center md:items-start'>
                {isSmallScreen ? (
                    <img src={tinyAppLogo} alt="Certrac Logo" className='h-7 w-10'/>
                ) : (
                    <img src={appLogo} alt="Certrac Logo" className='h-6 w-24'/>
                )}
                <div className='flex flex-col gap-1 w-full items-center'>
                    <button
                        className={`flex flex-row gap-3 2xl:gap-5 items-center w-fit md:w-full hover:bg-slate-500 focus:bg-slate-500 rounded-full md:rounded-2xl p-2 md:px-2 md:py-3 2xl:px-6 outline-none ${
                            isHomePage ? 'bg-slate-500' : ''}`}
                        autoFocus={true}
                        onClick={handleSetHomePage}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(249 249 249)" className="w-6 h-6">
                            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                        </svg>
                        {isSmallScreen ? (
                            <></>
                        ) : (
                            <span className="text-sm 2xl:text-lg text-white font-semibold">Home</span>
                        )}
                    </button>
                    <button
                        className={`flex flex-row gap-3 2xl:gap-5 items-center w-fit md:w-full hover:bg-slate-500 focus:bg-slate-500 rounded-full md:rounded-2xl p-2 md:px-2 md:py-3 2xl:px-6 outline-none ${
                            isHomePage ? '' : 'bg-slate-500'}`}
                        onClick={handleSetCalendarView}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(249 249 249)" className="w-6 h-6 md:w-5 md:h-5 2xl:w-6 2xl:h-6">
                            <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                        </svg>
                        {isSmallScreen ? (
                            <></>
                        ) : (
                            <span className="text-sm 2xl:text-lg text-white font-semibold">Calendar</span>
                        )}
                    </button>                   
                </div>
            </div>
            <div className="flex flex-col h-full w-full">
                <div className='flex basis-1/12 border-b border-gray-200 items-center justify-end py-2 px-6'>
                    <IconButton
                        onClick={handleProfileDropdown}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}></Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={dropdown}
                        id="account-menu"
                        open={open}
                        onClose={handleCloseProfileDropdown}
                        onClick={handleCloseProfileDropdown}
                        PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                            },
                            '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                            },
                        },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem className='pointer-events-none'>
                            <span>{localStorage.getItem("userEmail")}</span>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleOnLogoutOpenClicked}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
                <div className='flex basis-11/12'>
                    {!snackBarMessage && isHomePage && (
                        <TableView
                            rowData={userData}
                            handleNewRowData={handleNewRowData}
                            handleDeleteRowData={handleDeleteRowData}
                            handleRefreshRowData={handleRefreshRowData}/>
                    )}
                    {!snackBarMessage && !isHomePage &&(
                        <CalendarView
                            calendarData={userData}/>
                    )}
                </div>
            </div>
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
            {openLogoutConfirmationDialog &&
                <Dialog
                    open={openLogoutConfirmationDialog}
                    onClose={handleOnLogoutCloseClicked}
                >
                    <div className="flex flex-col">
                        <div className="flex flex-row items-center">
                            <div className="flex items-center pl-3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" class="w-16 h-16">
                                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="pt-4 pb-2 px-6 font-semibold text-2xl">Are you sure?</span>
                                <span className="pb-4 px-6 font-normal text-md">This action will log you off and return to login page</span>
                            </div>
                        </div>
                        <div className='flex flex-row px-5 pb-5 justify-end gap-4'>
                            <button
                                className='border border-gray-200 py-2 px-3 text-black rounded-md outline-0 hover:bg-gray-100'
                                onClick={handleOnLogoutCloseClicked}
                            >Cancel</button>
                            <button
                                className='bg-red-500 py-2 px-3 text-white rounded-lg outline-0 hover:bg-red-600'
                                onClick={handleLogOut}
                            >LOGOUT</button>
                        </div>
                    </div>
              </Dialog>
            }
        </div>
    )
}

export default Dashboard;