import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React, {
    useMemo,
    useState,
    useCallback,
    useRef,
  } from 'react';
import getData from '../data';
import "./tableView.css";

const TableViewComponent = () => {
    const gridRef = useRef();
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
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
        "alreadyExpired": params => params.value == "Already Expired!",
        "expiringSoon": params => params.value.substring(0, params.value.indexOf(' ')) <= 30,
        "otherDomains": params => params.value.substring(0, params.value.indexOf(' ')) > 30
    };
    const cellRenderer = (params) => {
        return <span class="cell-element px-3 py-2">{params.value}</span>;
    };
    const [rowData, setRowData] = useState(getData());
    const [columnDefs, setColumnDefs] = useState([
        { field: 'domain', headerCheckboxSelection: true, checkboxSelection: true, showDisabledCheckboxes: true },
        { field: 'issuer' },
        { field: 'expiryDate' },
        { field: 'isNotified', headerName: 'Receive Notifications', editable: true },
        { field: 'daysBeforeNotified', editable: customEditDaysBeforeNotified, valueGetter: daysBeforeNotified },
        { headerName: 'Expiry Status', valueGetter: noOfDaysLeftForExpiry, cellClassRules: cellClassRules, cellRenderer: cellRenderer }
    ]);
    
    const defaultColDef = useMemo(() => {
        return {
            sortable: true,
            filter: true,
            resizable: true
        };
    }, []);

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
          document.getElementById('search').value
        );
    }, []);

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
                    <button className='bg-teal-500 py-2 px-3 text-white rounded-md outline-0 hover:bg-teal-600'>Add Domain</button>
                    <button className='bg-teal-500 py-2 px-3 text-white rounded-md outline-0 hover:bg-teal-600'>Save</button>
                    <button className='bg-teal-500 py-2 px-3 text-white rounded-md outline-0 hover:bg-teal-600'>Delete</button>
                    <button className='bg-teal-500 py-2 px-3 text-white rounded-md outline-0 hover:bg-teal-600'>Refresh</button>
                    <button className='bg-teal-500 py-2 px-3 text-white rounded-md outline-0 hover:bg-teal-600'>Check Certificate Details</button>
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