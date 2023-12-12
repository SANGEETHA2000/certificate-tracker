import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const CheckCertificateDetailsDialog = ({ openCheckCertificateDetailsDialog,
                                                handleCloseCheckCertificateDetailsDialog,
                                                handleCloseCheckCertificateDetailsDialogAndClearData,
                                                checkDomainName, setCheckDomainName,
                                                handleSubmitCheckDetails,
                                                checkDomainIssuer, checkDomainExpiry, checkDomainValidFrom,
                                                handleMonitorDomain }) => {

    return (
        <>
            <Dialog open={openCheckCertificateDetailsDialog} onClose={handleCloseCheckCertificateDetailsDialog}>
                <span className="pt-4 px-6 font-semibold text-2xl">Get Domain Certificate Details</span> 
                <DialogContent className='flex flex-col'>
                    <div className='flex flex-row justify-between'>
                        <input
                            type="text" id="domain" name="domain"
                            placeholder="Enter domain name"
                            className='outline-0 p-2 w-5/6 border-2 border-teal-400 border-solid focus-within:border-teal-500'
                            value={checkDomainName}
                            onChange={setCheckDomainName}
                        />
                        <button
                            type="button"
                            className='w-1/6 bg-teal-500 flex items-center justify-center text-white hover:bg-teal-600'
                            onClick={handleSubmitCheckDetails}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button> 
                    </div>
                    <DialogContentText className='pt-5'>
                        {checkDomainIssuer && (
                            <table>
                                <tbody>
                                    <tr key="valid_from">
                                        <td className='font-bold p-2'>Valid From</td>
                                        <td className='p-2'>{checkDomainValidFrom}</td>
                                    </tr>
                                    <tr key="valid_until">
                                        <td className='font-bold p-2'>Valid Until</td>
                                        <td className='p-2'>{checkDomainExpiry}</td>
                                    </tr>
                                    <tr key="issuer">
                                        <td className='font-bold p-2'>Issuer</td>
                                        <td className='p-2'>{checkDomainIssuer}</td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </DialogContentText>
                </DialogContent>
                <div className='flex flex-row px-5 pb-5 justify-center gap-4'>
                    <button
                        className='border border-gray-200 py-2 px-3 text-black rounded-md outline-0 hover:bg-gray-100'
                        onClick={handleCloseCheckCertificateDetailsDialogAndClearData}
                    >Close</button>
                    {checkDomainIssuer && (
                        <button
                            className='bg-emerald-500 py-2 px-3 text-white rounded-lg outline-0 hover:bg-emerald-600'
                            onClick={handleMonitorDomain}
                        >Monitor this domain</button>
                    )}
                </div>              
            </Dialog>
        </>        
    );
};

export default CheckCertificateDetailsDialog;
