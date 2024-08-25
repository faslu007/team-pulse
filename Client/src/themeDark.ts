import { createTheme } from '@mui/material/styles';

// Define a primary color and light base
const primaryBlue = '#007bff';
const lightBase = '#f5f5f5';
const accentColor = '#ff9800'; // Add an accent color for highlights

const theme = createTheme({
    palette: {
        mode: 'light', // Set the theme mode to light
        primary: {
            main: primaryBlue,
        },
        secondary: {
            main: '#6c757d',
        },
        error: {
            main: '#dc3545',
        },
        warning: {
            main: accentColor,
        },
        background: {
            default: lightBase, // Set the default background color
            paper: '#ffffff',  // Paper backgrounds should be white in light mode
        },
        text: {
            primary: '#333333', // Dark text color for readability on light background
            secondary: '#555555',
            disabled: '#b0b0b0', // Light gray for disabled text
        },
    },
    typography: {
        fontFamily: [
            'Lato',
            '-apple-system',
            'BlinkMacSystemFont',
            'Poppins',
            'Roboto',
            'Segoe UI',
            'Arial',
            'sans-serif',
            'Apple Color Emoji',
            'Segoe UI Emoji',
            'Segoe UI Symbol',
        ].join(','),
        h1: {
            fontSize: '2rem',
            fontWeight: 700,
            color: primaryBlue,
        },
        h2: {
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#333333',
        },
        body1: {
            fontSize: '1rem',
            color: '#555555',
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        color: '#333333', // Dark text color for input
                        backgroundColor: '#ffffff', // White background for text fields
                        borderRadius: 4,
                        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                        '&:hover': {
                            backgroundColor: '#f0f0f0', // Slightly darker on hover
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#555555', // Slightly muted label color
                    },
                    '& .Mui-focused': {
                        color: primaryBlue, // Highlight color when focused
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '& .MuiSelect-select': {
                        color: '#333333', // Dark text color
                        backgroundColor: '#ffffff', // White background for select boxes
                        borderRadius: 4,
                        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                            backgroundColor: '#f0f0f0',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#555555', // Muted label color
                    },
                    '& .Mui-disabled': {
                        backgroundColor: lightBase, // Match the light base background
                        color: '#6c757d', // Use a muted color for disabled text
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#b0b0b0', // Light gray border for disabled state
                        },
                    },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: '#333333', // Dark checkbox color
                    '&.Mui-checked': {
                        color: primaryBlue, // Color for checked state
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff', // Paper components have a white background in light mode
                    padding: '16px', // Add padding for a comfortable layout
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
                    borderRadius: 8, // Rounded corners for a modern look
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Disable uppercase text
                    fontWeight: 600, // Bold text for emphasis
                    borderRadius: 8, // Rounded corners
                    padding: '8px 16px', // Comfortable padding
                    '&:hover': {
                        backgroundColor: accentColor, // Highlight on hover
                        color: '#ffffff',
                    },
                },
            },
        },
    },
});

export default theme;
