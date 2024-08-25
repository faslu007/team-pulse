import React, { useState } from "react";
import { Box, Button, TextField, Typography, Grid, InputAdornment, IconButton } from "@mui/material";
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import { RegisterInput } from "./AuthInterface";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../Store";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { registerUser } from "./AuthThunk";

const Register: React.FC = () => {
    const dispatch = useAppDispatch();
    const registerInput: RegisterInput = useAppSelector((state: RootState) => state.auth.registerInput);
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    });


    const handleUserRegisterApiSubmission = () => {
        dispatch(registerUser(registerInput));
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
                Register
            </Typography>

            <Grid container flexDirection="row" spacing={2} width={"100%"} sx={{ padding: 0 }}>


                <Grid item xs={6}>
                    <TextField
                        type="text"
                        label="First Name"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={registerInput.firstName}
                        onChange={(e) => {
                            dispatch({
                                type: "auth/updateInputFieldValues",
                                payload: {
                                    stateToUpdate: "registerInput",
                                    field: "firstName",
                                    value: e.target.value
                                }
                            })
                        }}
                    />
                </Grid>


                <Grid item xs={6}>
                    <TextField
                        type="text"
                        label="Last Name"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        value={registerInput.lastName}
                        onChange={(e) => {
                            dispatch({
                                type: "auth/updateInputFieldValues",
                                payload: {
                                    stateToUpdate: "registerInput",
                                    field: "lastName",
                                    value: e.target.value
                                }
                            })
                        }}
                    />
                </Grid>
            </Grid>


            <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                variant="outlined"
                value={registerInput.email}
                onChange={(e) => {
                    dispatch({
                        type: "auth/updateInputFieldValues",
                        payload: {
                            stateToUpdate: "registerInput",
                            field: "email",
                            value: e.target.value
                        }
                    })
                }}
            />


            <TextField
                label="Password"
                fullWidth
                margin="normal"
                variant="outlined"
                value={registerInput.password}
                onChange={(e) => {
                    dispatch({
                        type: "auth/updateInputFieldValues",
                        payload: {
                            stateToUpdate: "registerInput",
                            field: "password",
                            value: e.target.value
                        }
                    })
                }}
                type={showPassword.password ? 'text' : 'password'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword({ ...showPassword, password: !showPassword.password })}
                                edge="end"
                            >
                                {showPassword.password ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <TextField
                label="Confirm Password"
                fullWidth
                margin="normal"
                variant="outlined"
                value={registerInput.confirmPassword}
                onChange={(e) => {
                    dispatch({
                        type: "auth/updateInputFieldValues",
                        payload: {
                            stateToUpdate: "registerInput",
                            field: "confirmPassword",
                            value: e.target.value
                        }
                    })
                }}
                type={showPassword.confirmPassword ? 'text' : 'password'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword({ ...showPassword, confirmPassword: !showPassword.confirmPassword })}
                                edge="end"
                            >
                                {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                    fontWeight: 'bold',
                    mt: 2, // Margin top
                    py: 1.5, // Padding vertical
                    fontSize: "large"
                }}
                startIcon={<AppRegistrationRoundedIcon fontSize="large" />}
                onClick={handleUserRegisterApiSubmission}
            >
                Register
            </Button>
        </Box>
    );
};

export default Register;
