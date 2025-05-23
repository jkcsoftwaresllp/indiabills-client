import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";

interface Props {
    handleClose: () => void;
    open: boolean;
    children: React.ReactNode;
    title?: string;
    submit: () => void;
}

const Modal: React.FC<Props> = ({ handleClose, open, title, children, submit }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Location</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {title}
                </DialogContentText>

                {children}

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={submit}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}

export default Modal