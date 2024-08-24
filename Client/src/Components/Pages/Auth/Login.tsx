import React, { useState } from "react";
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { RootState } from "../../../Store";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginUser } from "./AuthThunk";
import { AuthState, LoginInput } from "./AuthInterface";
import CircularProgress from '@mui/material/CircularProgress';


const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const loginInput: LoginInput = useAppSelector((state: RootState) => state.auth.loginInput);
    const apiStatus: AuthState["apiStatus"] = useAppSelector((state: RootState) => state.auth.apiStatus);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        dispatch(loginUser(loginInput));
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="100%"
            maxWidth={500}
            mx="auto"
            p={3}
            bgcolor="#2c313e" // White background for the form
            borderRadius={2}
            boxShadow={5} // Add shadow for depth
        >
            <Typography variant="h4" gutterBottom fontWeight={500}>
                Login
            </Typography>

            <TextField
                type="email"
                label="Email"
                value={loginInput.email}
                fullWidth
                margin="normal"
                variant="outlined"
                autoComplete="email"
                onChange={(e) => {
                    dispatch({
                        type: "auth/updateInputFieldValues",
                        payload: {
                            stateToUpdate: "loginInput",
                            field: "email",
                            value: e.target.value
                        }
                    })
                }}
            />

            <TextField
                label="Password"
                value={loginInput.password}
                fullWidth
                margin="normal"
                variant="outlined"
                autoComplete="current-password"
                onChange={(e) => {
                    dispatch({
                        type: 'auth/updateInputFieldValues',
                        payload: {
                            stateToUpdate: 'loginInput',
                            field: 'password',
                            value: e.target.value,
                        },
                    });
                }}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Button
                disabled={apiStatus.isLoading}
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                    fontWeight: 'bold',
                    mt: 2, // Margin top
                    py: 1.5, // Padding vertical
                    fontSize: "large"
                }}
                startIcon={<LoginRoundedIcon fontSize="large" />}
                onClick={handleLogin}
            >
                {
                    !apiStatus.isLoading ? "Login" : <CircularProgress color="inherit" />
                }
            </Button>
        </Box>
    );
};

export default Login;
