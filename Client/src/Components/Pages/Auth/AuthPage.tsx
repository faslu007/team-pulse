import { Box, Divider } from "@mui/material";
import Login from "./Login";
import Register from "./Register";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


import { useAppDispatch, useAppSelector } from "../../../hooks";
import { RootState } from "../../../Store";
import { AuthState } from "./AuthInterface";
import { useSnackbar } from "../../../commons/Snackbar/Snackbar";


const Auth: React.FC = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const apiStatus: AuthState["apiStatus"] = useAppSelector((state: RootState) => state.auth.apiStatus);
    const sessionUser = useAppSelector((state: RootState) => state.auth.sessionUser);


    useEffect(() => {
        if (apiStatus.message) {
            showSnackbar(true, apiStatus.isError ? "error" : apiStatus.isSuccess ? "success" : "warning", apiStatus.message, 4000);
            dispatch({ type: "auth/resetStatusState" })
        }
    }, [apiStatus.message])

    useEffect(() => {
        if (sessionUser?.id) {
            navigate('/manage-session');
        }
    }, [sessionUser?.id])

    return (
        <>
            <Box
                display="flex"
                height="100vh"
                width="100%"
                justifyContent="center"
                alignItems="center"
            >
                <Box
                    display="flex"
                    width="100%"
                    height="100%"
                    borderRadius={2}
                    boxShadow={3}
                >
                    <Box
                        flex={1}
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        p={2}
                    >
                        <Login />
                    </Box>

                    <Divider
                        variant="middle"
                        orientation="vertical"
                        flexItem
                        sx={{
                            borderWidth: 2
                        }}
                    />

                    <Box
                        flex={1}
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        p={2}
                    >
                        <Register />
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default Auth;
