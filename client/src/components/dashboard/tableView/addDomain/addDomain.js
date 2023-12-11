import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const AddDomainDialog = ({ openAddDomainDialog,
                                    handleCloseAddDomainDialog,
                                    addDomainName, setAddDomainName,
                                    notificationDays, setNotificationDays,
                                    isNotificationEnabled, setIsNotificationEnabled,
                                    handleSubmitAddDomain, isAddAfterCheck }) => {

    return (
        <Dialog open={openAddDomainDialog} onClose={handleCloseAddDomainDialog} fullWidth={true}> 
            <DialogTitle>Add a new domain to monitor</DialogTitle> 
            <DialogContent className='flex flex-col gap-5'>
                <form className='flex flex-col gap-4'>
                    <div className='flex flex-row justify-start'>
                        <label className='pr-4 text-lg w-7/12'>Domain name</label>
                        <input
                            type="text" id="domain" name="domain"
                            className='w-5/12 outline-0 p-1 border-2 border-teal-400 border-solid focus-within:border-teal-500'
                            value={addDomainName}
                            onChange={setAddDomainName}
                            disabled={isAddAfterCheck}
                        />
                    </div>
                    <div className='flex flex-row justify-start'>
                        <label className='pr-4 text-lg w-7/12'>Receive notification closer to expiry</label>
                        <input
                            type="checkbox" id="notification" name="notification"
                            checked={isNotificationEnabled}
                            onChange={setIsNotificationEnabled}
                        />
                    </div>
                    {isNotificationEnabled && (
                        <div className='flex flex-row justify-start'>
                            <label className='pr-4 text-lg w-7/12'>No. of days before you would like to get notified</label>
                            <input
                                type="number" id="notificationDays" name="notificationDays"
                                className='w-5/12 outline-0 p-1 border-2 border-teal-400 border-solid focus-within:border-teal-500'
                                value={notificationDays}
                                onChange={setNotificationDays}
                                autoFocus={true}
                                min="1" max="90"
                            />
                        </div>
                    )}
                </form>
            </DialogContent> 
            <div className='flex flex-row p-5'>
                <div className='flex w-1/2 item-center justify-center'>
                    <button
                        className='bg-teal-500 py-2 px-3 text-white rounded-md outline-0 hover:bg-teal-600'
                        onClick={handleSubmitAddDomain}
                    >Submit</button>
                </div>
                <div className='flex w-1/2 item-center justify-center'>
                    <button
                        className='bg-red-500 py-2 px-3 text-white rounded-lg outline-0 hover:bg-red-600'
                        onClick={handleCloseAddDomainDialog}
                    >Cancel</button>
                </div>
            </div>
        </Dialog>
    )
}

export default AddDomainDialog;