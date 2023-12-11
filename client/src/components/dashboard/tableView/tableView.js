import "./tableView.css"
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import CheckCertificateDetailsDialog from './checkCertificateDetails/checkCertificateDetails';
import AddDomainDialog from './addDomain/addDomain';


const TableView = ( { rowData, handleNewRowData, handleDeleteRowData, handleRefreshRowData } ) => {
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
    const [deletionRowsSelected, setDeletionRowsSelected] = useState([]);
    const [isRefreshDeleteEnabled, setIsRefreshDeleteEnabled] = useState(false);
    const [refreshRowsSelected, setRefreshRowsSelected] = useState([]);
    const [isModifyEnabled, setIsModifyEnabled] = useState(false);
    const [modifiedRows, setModifiedRows] = useState([]);
    const [noOfRows, setNoOfRows] = useState(rowData.length);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

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
        { field: 'daysBeforeNotified', editable: customEditDaysBeforeNotified, valueGetter: daysBeforeNotified, valueParser: params => Number(params.newValue) },
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

    const handleCloseCheckCertificateDetailsDialog = (event, reason) => {
        if (reason && reason == "backdropClick") 
            return;
        setIsCheckCertificateDetailsOpen(false);
    };

    const handleCloseCheckCertificateDetailsDialogAndClearData = (event, reason) => {
        if (reason && reason == "backdropClick") 
            return;
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

    const handleCloseAddDomainDialog = (event, reason) => {
        if (reason && reason == "backdropClick") 
            return;
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
            const response = await axios.post('http://localhost:5000/api/add-domain', {
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
                    lastEmailSent: null,
                    _id: response.data._id
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
            .get(`http://localhost:5000/api/get-domain-certificate-details?domain=${addDomainName}`)
            .then((response) => {
                setAddDomainIssuer(response.data.issuer);
                setAddDomainValidFrom(response.data.valid_from);
                setAddDomainExpiry(response.data.valid_until);
                setAddDomainError('');
            })
            .catch((err) => {
                console.log(err)
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
        console.log("new domain use effect")
        if(newDomainDetail && Object.keys(newDomainDetail).length !== 0) {
            handleNewRowData(newDomainDetail);
        }
    }, [newDomainDetail]);

    useEffect (() => {
        console.log("add domainn new effect")
        if(addDomainName && addDomainName!=="" && isAddDomainOpen && !isDomainNamePresent()) {
            handleSubmitAddDomain();
        }
        else if(isDomainNamePresent()) {
            setAddDomainError('Domain is already being monitored!');
        }
    }, [ addDomainExpiry, addDomainIssuer ]);
    
    const onSelectionChanged = useCallback((event) => {
        event.api.getSelectedNodes().length > 0 ? setIsRefreshDeleteEnabled(true) : setIsRefreshDeleteEnabled(false);
        setDeletionRowsSelected(event.api.getSelectedNodes().map(item => item.data._id));
        setRefreshRowsSelected(event.api.getSelectedNodes().map(item => ({
            domain : item.data.domain,
            _id: item.data._id
        })));
    }, []);

    const handleOnDeleteClicked = async () => {
        try {
            await axios.delete('http://localhost:5000/api/delete-domains', {
                data: { domains: deletionRowsSelected }
            });
            handleDeleteRowData(deletionRowsSelected);
            setDeletionRowsSelected([]);
            setAddDomainError('');
            setIsRefreshDeleteEnabled(false);
        } catch (err) {
            setAddDomainError(err.response?.data?.error || 'An unexpected error occurred!');
        }
    }

    const handleOnRefreshClicked = async () => {
        try {
            const response = await axios.put('http://localhost:5000/api/update-domain-certificate-details', {
                field: "expiry", "domains": refreshRowsSelected 
            });
            handleRefreshRowData(response.data.updated);
            setRefreshRowsSelected([]);
            setAddDomainError('');
            setIsRefreshDeleteEnabled(false);
        } catch (err) {
            setAddDomainError(err.response?.data?.error || 'An unexpected error occurred!');
        }
    }

    const handleOnModifyClicked = async () => {
        try {
            const response = await axios.put('http://localhost:5000/api/update-domain-certificate-details', {
                field: "notifications", "domains": modifiedRows
            });
            handleRefreshRowData(response.data.updated);
            setModifiedRows([]);
            setAddDomainError('');
            setIsModifyEnabled(false);
            const gridApi = gridRef.current.api;
            const columnsToRemoveStyle = ['daysBeforeNotified', 'isNotified'];
            columnsToRemoveStyle.forEach(column => {
                const columnApi = gridApi.getColumnApi();
                const colDef = columnApi.getColumn(column).getColDef();
                colDef.cellStyle = null;
            });

            gridApi.redrawRows();
        } catch (err) {
            setAddDomainError(err.response?.data?.error || 'An unexpected error occurred!');
        }
    } 

    const handleCellValueChanged = (params) => {
        setIsModifyEnabled(true);
        if (params.oldValue !== params.newValue) {
            if (typeof params.value === 'boolean') {
                params.data.daysBeforeNotified = params.value ? 30 : null;
            }
            var column = params.column.colDef.field;
            params.column.colDef.cellStyle = { 'backgroundColor': 'lightyellow' };
            params.api.refreshCells({
                force: true,
                columns: [column],
                rowNodes: [params.node]
            });
            const modifiedRow = { _id: params.data._id, updatedData: params.data };
            const existingIndex = modifiedRows.findIndex(row => row._id ===params.data._id);
            if (existingIndex !== -1) {
                const updatedmodifiedRows = [...modifiedRows];
                updatedmodifiedRows[existingIndex] = modifiedRow;
                setModifiedRows(updatedmodifiedRows);
            } else {
                setModifiedRows(prev => [...prev, modifiedRow]);
            }
        }
    };

    useEffect(() => {
        setNoOfRows(rowData.length);
    }, [rowData]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            const { width } = entries[0].contentRect;
            setIsSmallScreen(width < 768);
        });
        resizeObserver.observe(window.document.body);
        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div className='bg-white w-full h-full flex flex-col'>
            <div className='flex flex-row px-2 md:px-5 py-3 items-center justify-between'>
                <span className="text-teal-900 text-base font-bold md:text-xl">List of monitored domains</span>
                <div className="flex gap-1 md:gap-2 lg:gap-4">
                    <button
                        className='flex flex-row items-center gap-1 bg-teal-500 py-1 px-1 lg:py-2 lg:px-3 text-white rounded-full md:rounded-lg lg:rounded-xl outline-0 hover:bg-teal-600'
                        onClick={handleOpenAddDomainDialog}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {isSmallScreen ? (
                            <></>
                        ) : (
                            <span className="font-semibold">Add Domain</span>
                        )}
                    </button>
                    <button
                        className='flex flex-row items-center gap-1 bg-teal-500 py-1 px-1 lg:py-2 lg:px-3 text-white rounded-full md:rounded-lg lg:rounded-xl outline-0 hover:bg-teal-600'
                        onClick={handleOpenCheckCertificateDetailsDialog}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                        {isSmallScreen ? (
                            <></>
                        ) : (
                            <span className="font-semibold">Check Certificate Details</span>
                        )}
                    </button>
                </div>
            </div>
            <div className='flex flex-row px-2 md:px-5 py-1 md:py-3 justify-between w-full gap-2 md:gap-4 lg:gap-6 items-center'>
                <div className='flex flex-row gap-1 items-center w-full p-1 rounded-full bg-slate-100'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="rgb(45 212 191)" className="pl-1 w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="text" id="search" name="search"
                        placeholder="Search domain..."
                        className='outline-0 w-full p-1 bg-slate-100 rounded-full text-xs md:text-base'
                        disabled={noOfRows===0 ? true : false}
                        title="Search domain from the table below"
                        onInput={onFilterTextBoxChanged}
                    />
                </div>
                <div className='flex gap-1 md:gap-2 lg:gap-4 h-fit'>            
                    <button
                        className='flex flex-row items-center gap-1 bg-teal-500 py-1 px-1 lg:py-2 lg:px-3 text-white rounded-full md:rounded-lg lg:rounded-xl outline-0 hover:bg-teal-600 disabled:bg-teal-200 disabled:text-teal-50'
                        disabled={!isModifyEnabled}
                        onClick={handleOnModifyClicked}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fill-rule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 001.075.676L10 15.082l5.925 2.844A.75.75 0 0017 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0010 2z" clip-rule="evenodd" />
                        </svg>
                        {isSmallScreen ? (
                            <></>
                        ) : (
                            <span className="font-semibold">Save</span>
                        )}
                    </button>
                    <button
                        className='flex flex-row items-center gap-1 bg-teal-500 py-1 px-1 lg:py-2 lg:px-3 text-white rounded-full md:rounded-lg lg:rounded-xl outline-0 hover:bg-teal-600 disabled:bg-teal-200 disabled:text-teal-50'
                        disabled={!isRefreshDeleteEnabled}
                        onClick={handleOnDeleteClicked}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                        </svg>
                        {isSmallScreen ? (
                            <></>
                        ) : (
                            <span className="font-semibold">Delete</span>
                        )}
                    </button>
                    <button
                        className='flex flex-row items-center gap-1 bg-teal-500 py-1 px-1 lg:py-2 lg:px-3 text-white rounded-full md:rounded-lg lg:rounded-xl outline-0 hover:bg-teal-600 disabled:bg-teal-200 disabled:text-teal-50'
                        disabled={!isRefreshDeleteEnabled}
                        onClick={handleOnRefreshClicked}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        {isSmallScreen ? (
                            <></>
                        ) : (
                            <span className="font-semibold">Refresh</span>
                        )}
                    </button>
                </div>
            </div>
            <div style={containerStyle} className='px-2 md:px-5 py-3'>
                <div style={gridStyle} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        rowSelection={'multiple'}
                        suppressRowClickSelection={true}
                        onSelectionChanged={onSelectionChanged}
                        onCellValueChanged={handleCellValueChanged}
                    />
                </div>
            </div>
            {isAddDomainOpen &&
                <AddDomainDialog
                    openAddDomainDialog={isAddDomainOpen}
                    handleCloseAddDomainDialog={handleCloseAddDomainDialog}
                    addDomainName={addDomainName} setAddDomainName={handleChangeAddDomainName}
                    notificationDays={notificationDays} setNotificationDays={handleNotificationDays}
                    isNotificationEnabled={isNotificationEnabled} setIsNotificationEnabled={handleNotificationEnabled}
                    handleSubmitAddDomain={getDomainDetails}
                    domainNameError={addDomainError} isAddAfterCheck={isAddAfterCheck} />
            }
            {isCheckCertificateDetailsOpen &&
                <CheckCertificateDetailsDialog
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
    )
}

export default TableView;