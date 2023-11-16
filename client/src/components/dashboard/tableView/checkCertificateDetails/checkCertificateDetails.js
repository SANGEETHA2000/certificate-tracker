import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import AddDomainDialogComponent from '../addDomain/addDomain';

const CheckCertificateDetailsDialogComponent = ({ open, handleClose }) => {
    const [domainDetails, setDomainDetails] = useState(null);
    const [domainName, setDomainName] = useState('');
    const [domainNameError, setDomainNameError] = useState('');
    const [openAddDomainDialog, setOpenAddDomainDialog] = useState(false);

    const handleDomainNameSubmit = () => {
        axios
         .get(`http://localhost:5000/api/domain-certificate?domain=${domainName}`)
         .then((response) => {
            console.log(response)
            setDomainDetails(response.data);
            setDomainNameError('');
         })
         .catch((err) => {
            setDomainNameError(err.response.data.error);
            setDomainDetails('');
         });
    };

    const handleAddDomain = () => {
        setOpenAddDomainDialog(true);
        handleClose();
    };

    return (
        <React.Fragment>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Check SSL Certificate Details</DialogTitle>
                <DialogContent className='flex flex-col'>
                    <div className='flex flex-row justify-between'>
                        <input
                            type="text" id="domain" name="domain"
                            placeholder="Enter domain name"
                            className='outline-0 p-2 w-5/6 border-2 border-teal-400 border-solid focus-within:border-teal-500'
                            value={domainName}
                            onChange={(e) => setDomainName(e.target.value)}
                        />
                        <button
                            type="button"
                            className='w-1/6 bg-teal-500 flex items-center justify-center text-white hover:bg-teal-600'
                            onClick={handleDomainNameSubmit}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button> 
                    </div>
                    <DialogContentText className='pt-5'>
                        {domainDetails && (
                            <table>
                                <tbody>
                                    <tr key="valid_from">
                                        <td className='font-bold p-2'>Valid From</td>
                                        <td className='p-2'>{domainDetails.valid_from}</td>
                                    </tr>
                                    <tr key="valid_until">
                                        <td className='font-bold p-2'>Valid Until</td>
                                        <td className='p-2'>{domainDetails.valid_until}</td>
                                    </tr>
                                    <tr key="issuer">
                                        <td className='font-bold p-2'>Issuer</td>
                                        <td className='p-2'>{domainDetails.issuer}</td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                        {domainNameError && (
                            <div className='flex flex-col items-center justify-center gap-6 pb-5'>
                                <p className='text-red-700 text-center'>{domainNameError}</p>
                                <button
                                    className='bg-red-500 py-2 px-3 text-white rounded-lg outline-0 hover:bg-red-600'
                                    onClick={handleClose}
                                >Close</button>
                            </div>
                        )}
                    </DialogContentText>
                </DialogContent>
                {domainDetails && (
                    <div className='flex flex-row items-center justify-center gap-6 pb-5'>
                        <button
                            className='bg-teal-500 py-2 px-3 text-white rounded-md outline-0 hover:bg-teal-600'
                            onClick={handleAddDomain}
                        >Monitor this domain</button>
                        <button
                            className='bg-red-500 py-2 px-3 text-white rounded-lg outline-0 hover:bg-red-600'
                            onClick={handleClose}
                        >Close</button>
                    </div>
                )}
            </Dialog>

            {/* {openAddDomainDialog && ( */}
                <AddDomainDialogComponent
                    open={openAddDomainDialog}
                    handleClose={() => setOpenAddDomainDialog(false)}
                    domainName={domainName}
                />
            {/* )} */}
        </React.Fragment>        
    );
};

export default CheckCertificateDetailsDialogComponent;
