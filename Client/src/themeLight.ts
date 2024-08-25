import { createTheme } from '@mui/material/styles';

// Define a blue base color for primary styling
const primaryBlue = '#007bff';
const darkBase = '#2c313e';

const theme = createTheme({
    palette: {
        mode: 'dark', // Set the theme mode to dark
        primary: {
            main: primaryBlue,
        },
        secondary: {
            main: '#6c757d',
        },
        error: {
            main: '#dc3545',
        },
        background: {
            default: darkBase, // Set the default background color
            paper: darkBase,  // Ensure paper backgrounds are also dark
        },
        text: {
            primary: '#e0e0e0', // Light text color for better readability on dark background
            secondary: '#b0b0b0',
        },
    },
    typography: {
        fontFamily: [
            'Lato',
            '-apple-system',
            'BlinkMacSystemFont',
            'poppins',
            'roboto',
            'Segoe UI',
            'Arial',
            'sans-serif',
            'Apple Color Emoji',
            'Segoe UI Emoji',
            'Segoe UI Symbol',
        ].join(','),
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        color: '#e0e0e0', // Light text color
                        backgroundColor: '#3a3f55', // Slightly lighter background for text fields
                        borderRadius: 4,
                    },
                    '& .MuiInputLabel-root': {
                        color: '#b0b0b0', // Lighter label color
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '& .MuiSelect-select': {
                        color: '#e0e0e0', // Light text color
                        backgroundColor: '#3a3f55', // Slightly lighter background for select boxes
                    },
                    '& .MuiInputLabel-root': {
                        color: '#b0b0b0', // Lighter label color
                    },
                    '& .Mui-disabled': {
                        backgroundColor: '#2c313e', // Match the dark base background
                        color: '#6c757d', // Use a muted color for disabled text
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6c757d', // Light gray border for disabled state
                        },
                    },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: '#e0e0e0', // Light checkbox color
                    '&.Mui-checked': {
                        color: primaryBlue, // Color for checked state
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: darkBase, // Ensure paper components have the dark base color
                },
            },
        },
    },
});

export default theme;
