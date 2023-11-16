import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/DialogTitle';
import axios from 'axios';

const AddDomainDialogComponent = ({ open, handleClose, domainName }) => {
    return (
        <Dialog open={open} onClose={handleClose}> 
            <DialogTitle> 
            Greetings from GeeksforGeeks {domainName}
            </DialogTitle> 
            <DialogContent> 
            <DialogContentText> 
                Do you do coding ? 
            </DialogContentText> 
            </DialogContent> 
            <DialogActions> 
            <Button onClick={handleClose} color="primary"> 
            Close 
            </Button> 
            <Button onClick={handleClose} color="primary" autoFocus> 
            Yes 
            </Button> 
            </DialogActions> 
        </Dialog>
    )
}

export default AddDomainDialogComponent;