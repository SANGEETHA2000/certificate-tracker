import "./tableView.css"
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import CheckCertificateDetailsDialogComponent from './checkCertificateDetails/checkCertificateDetails';
import AddDomainDialogComponent from './addDomain/addDomain';


const TableViewComponent = ( {rowData, handleNewRowData} ) => {
    const gridRef = useRef();
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [isCheckCertificateDetailsOpen, setIsCheckCertificateDetailsOpen] = useState(false);
    const [isAddDomainOpen, setIsAddDomainOpen] = useState(false);
    const [addDomainName, setAddDomainName] = useState('');
    const [addDomainIssuer, setAddDomainIssuer] = useState('');
    const [addDomainValidFrom, setAddDomainValidFrom] = useState('');
    const [addDomainExpiry, setAddDomainExpiry] = useState('');
    const [notificationDays, setNotificationDays] = useState(30);
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
    const [addDomainError, setAddDomainError] = useState('');
    const [isAddAfterCheck, setIsAddAfterCheck] = useState(false);
    const [newDomainDetail, setNewDomainDetail] = useState({});

    const defaultColDef = useMemo(() => {
        return {
            sortable: true,
            filter: true,
            resizable: true
        };
    }, []);

    const noOfDaysLeftForExpiry = (params) => {
        const expiryDate = new Date(params.data.expiryDate);
        const currentDate = new Date();
        const differenceInMilliseconds = expiryDate - currentDate;
        const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24))
        return differenceInDays < 0 ? 'Already Expired!' : differenceInDays + ' days left';
    }

    const customEditDaysBeforeNotified = (params) => {
        return params.data.isNotified ? true : false;
    }
    
    const daysBeforeNotified = (params) => {
        return params.data.isNotified ? (params.data.daysBeforeNotified ? params.data.daysBeforeNotified : 30 ): null;
    }

    const cellClassRules = {
        "alreadyExpired": params => params.value === "Already Expired!",
        "expiringSoon": params => params.value.substring(0, params.value.indexOf(' ')) <= 30,
        "otherDomains": params => params.value.substring(0, params.value.indexOf(' ')) > 30
    };

    const cellRenderer = (params) => {
        return <span className="cell-element px-3 py-2">{params.value}</span>;
    };

    const [columnDefs, setColumnDefs] = useState([
        { field: 'domain', headerCheckboxSelection: true, checkboxSelection: true, showDisabledCheckboxes: true },
        { field: 'issuer' },
        { field: 'expiryDate' },
        { field: 'isNotified', headerName: 'Receive Notifications', editable: true },
        { field: 'daysBeforeNotified', editable: customEditDaysBeforeNotified, valueGetter: daysBeforeNotified },
        { headerName: 'Expiry Status', valueGetter: noOfDaysLeftForExpiry, cellClassRules: cellClassRules, cellRenderer: cellRenderer }
    ]);

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
          document.getElementById('search').value
        );
    }, []);

    const handleOpenCheckCertificateDetailsDialog = () => {
        setIsCheckCertificateDetailsOpen(true);
    };

    const handleCloseCheckCertificateDetailsDialog = () => {
        setIsCheckCertificateDetailsOpen(false);
    };

    const handleCloseCheckCertificateDetailsDialogAndClearData = () => {
        setIsCheckCertificateDetailsOpen(false);
        setAddDomainName("");
        setAddDomainValidFrom("");
        setAddDomainExpiry("");
        setAddDomainIssuer("");
        setAddDomainError('');
    };

    function handleChangeAddDomainName(e) {
        setAddDomainName(e.target.value);
    }

    const handleOpenAddDomainDialog = () => {
        setIsAddDomainOpen(true);
    };

    function handleNotificationDays(e) {
        setNotificationDays(e.target.value);
    }

    function handleNotificationEnabled() {
        setIsNotificationEnabled(!isNotificationEnabled);
    }

    function handleMonitorDomain() {
        setIsAddAfterCheck(true);
        handleCloseCheckCertificateDetailsDialog();
        handleOpenAddDomainDialog();
    }

    const handleCloseAddDomainDialog = () => {
        setIsAddDomainOpen(false);
        setIsAddAfterCheck(false);
        setAddDomainName("");
        setAddDomainValidFrom("");
        setAddDomainExpiry("");
        setAddDomainIssuer("");
        setIsNotificationEnabled(false);
        setNotificationDays(30);
        setAddDomainError('');
    };

    const isDomainNamePresent = () => {
        if (rowData){
            return rowData.some(item => item.domain === addDomainName);
        }
        return false;
    };

    const handleSubmitAddDomain = async () => {
        try {
            await axios.post('http://localhost:5000/api/add-domain', {
                email: localStorage.getItem("userEmail"),
                domain: addDomainName,
                issuer: addDomainIssuer,
                expiryDate: addDomainExpiry,
                isNotified: isNotificationEnabled,
                daysBeforeNotified: isNotificationEnabled ? notificationDays : null,
                inNotificationPeriod: false,
                lastEmailSent: null        
            });       
            setAddDomainError('');
            setNewDomainDetail(
                {
                    email: localStorage.getItem("userEmail"),
                    domain: addDomainName,
                    issuer: addDomainIssuer,
                    expiryDate: addDomainExpiry,
                    isNotified: isNotificationEnabled,
                    daysBeforeNotified: isNotificationEnabled ? notificationDays : null,
                    inNotificationPeriod: false,
                    lastEmailSent: null  
                }
            );
        } catch (err) {
            setAddDomainError(err.response?.data?.error || 'An unexpected error occurred!');
        }
        handleCloseAddDomainDialog();
    }

    const getDomainDetails = async () => {
        if (!isAddAfterCheck) {
            await axios
            .get(`http://localhost:5000/api/domain-certificate?domain=${addDomainName}`)
            .then((response) => {
                setAddDomainIssuer(response.data.issuer);
                setAddDomainValidFrom(response.data.valid_from);
                setAddDomainExpiry(response.data.valid_until);
                setAddDomainError('');
            })
            .catch((err) => {
                setAddDomainError(err.response?.data?.error || 'An unexpected error occurred!');
                setAddDomainIssuer('');
                setAddDomainValidFrom('');
                setAddDomainExpiry('');
            });
        }
        else {
            if (!isDomainNamePresent()) {
                handleSubmitAddDomain();
            } else {
                setAddDomainError('Domain is already being monitored!');
            }
        }
    };

    useEffect (() => {
        if(newDomainDetail && Object.keys(newDomainDetail).length !== 0) {
            handleNewRowData(newDomainDetail);
        }
    }, [newDomainDetail]);

    useEffect (() => {
        if(addDomainName && addDomainName!=="" && isAddDomainOpen && !isDomainNamePresent()) {
            handleSubmitAddDomain();
        }
        else if(isDomainNamePresent()) {
            setAddDomainError('Domain is already being monitored!');
        }
    }, [ addDomainExpiry, addDomainIssuer ]);
    

    return (
        <div className='bg-white w-full h-full flex flex-col'>
            <div className='flex flex-row p-5 justify-between'>
                <div className='w-5/12 border-b-2 border-teal-400 border-solid focus-within:border-teal-500'>
                    <input
                        type="text" id="search" name="search"
                        placeholder="Search domain..."
                        className='outline-0 p-2 w-full'
                        onInput={onFilterTextBoxChanged}
                    />
                </div>
                <div className='flex gap-4'>
                    
                    <button className='bg-teal-500 py-2 px-3 text-white rounded-md outline-0 hover:bg-teal-600'>Update</button>
                    <button className='bg-teal-500 py-2 px-3 text-white rounded-md outline-0 hover:bg-teal-600'>Delete</button>
                    <button className='bg-teal-500 py-2 px-3 text-white rounded-md outline-0 hover:bg-teal-600'>Refresh</button>

                    <div className="border-r-2 border-teal-200"></div>
                    <button
                        className='bg-teal-500 py-2 px-3 text-white rounded-md outline-0 hover:bg-teal-600'
                        onClick={handleOpenAddDomainDialog}>Add Domain
                    </button>
                    {isAddDomainOpen &&
                        <AddDomainDialogComponent
                            openAddDomainDialog={isAddDomainOpen}
                            handleCloseAddDomainDialog={handleCloseAddDomainDialog}
                            addDomainName={addDomainName} setAddDomainName={handleChangeAddDomainName}
                            notificationDays={notificationDays} setNotificationDays={handleNotificationDays}
                            isNotificationEnabled={isNotificationEnabled} setIsNotificationEnabled={handleNotificationEnabled}
                            handleSubmitAddDomain={getDomainDetails}
                            domainNameError={addDomainError} isAddAfterCheck={isAddAfterCheck} />
                    }

                    <button
                        className='bg-teal-500 py-2 px-3 text-white rounded-md outline-0 hover:bg-teal-600'
                        onClick={handleOpenCheckCertificateDetailsDialog}>Check Certificate Details
                    </button>
                    {isCheckCertificateDetailsOpen &&
                        <CheckCertificateDetailsDialogComponent
                            openCheckCertificateDetailsDialog={isCheckCertificateDetailsOpen}
                            handleCloseCheckCertificateDetailsDialog={handleCloseCheckCertificateDetailsDialog}
                            handleCloseCheckCertificateDetailsDialogAndClearData={handleCloseCheckCertificateDetailsDialogAndClearData}
                            checkDomainName={addDomainName} setCheckDomainName={handleChangeAddDomainName}
                            handleSubmitCheckDetails={getDomainDetails}
                            checkDomainIssuer={addDomainIssuer} checkDomainExpiry={addDomainExpiry} checkDomainValidFrom={addDomainValidFrom}
                            handleMonitorDomain={handleMonitorDomain}
                            domainNameError={addDomainError} />
                    }

                </div>
            </div>
            <div style={containerStyle} className='p-3'>
                <div style={gridStyle} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        rowSelection={'multiple'}
                        suppressRowClickSelection={true}       
                    />
                </div>
            </div>
        </div>
    )
}

export default TableViewComponent;