import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface SnackbarContextType {
    showSnackbar: (show: boolean, severity: 'success' | 'error' | 'info' | 'warning', text: string, timeOut?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
    const [message, setMessage] = useState('');
    const [autoHideDuration, setAutoHideDuration] = useState(4000);

    const showSnackbar = (show: boolean, severity: 'success' | 'error' | 'info' | 'warning', text: string, timeOut?: number) => {
        setOpen(show);
        setSeverity(severity);
        setMessage(text);
        if (timeOut) {
            setAutoHideDuration(timeOut);
        }
    };

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={autoHideDuration}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ '& .MuiSnackbarContent-root': { display: 'flex', justifyContent: 'center' } }}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (context === undefined) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};
