import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

const AddDomainDialog = ({ openAddDomainDialog,
                            handleCloseAddDomainDialog,
                            addDomainName, setAddDomainName,
                            notificationDays, setNotificationDays,
                            isNotificationEnabled, setIsNotificationEnabled,
                            handleSubmitAddDomain, isAddAfterCheck }) => {

    return (
        <Dialog open={openAddDomainDialog} onClose={handleCloseAddDomainDialog} fullWidth={true}> 
            <span className="py-4 px-6 font-semibold text-2xl">Add a new domain to monitor</span> 
            <DialogContent className='flex flex-col gap-5'>
                <form className='flex flex-col gap-4'>
                    <div className='flex flex-row justify-start'>
                        <label className='pr-4 text-lg w-7/12'>Domain name</label>
                        <input
                            type="text" id="domain" name="domain"
                            className='w-5/12 outline-0 p-1 border-2 border-gray-400 border-solid focus-within:border-gray-500'
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
            <div className='flex flex-row px-5 pb-5 justify-end gap-4'>
                <button
                    className='border border-gray-200 py-2 px-3 text-black rounded-md outline-0 hover:bg-gray-100'
                    onClick={handleCloseAddDomainDialog}
                >Cancel</button>
                <button
                    className='bg-emerald-500 py-2 px-3 text-white rounded-lg outline-0 hover:bg-emerald-600'
                    onClick={handleSubmitAddDomain}
                >Add Domain</button>
            </div>
        </Dialog>
    )
}

export default AddDomainDialog;