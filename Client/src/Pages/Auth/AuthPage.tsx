import { Box, Divider, useMediaQuery, Typography } from "@mui/material";
import { useTheme as muiUseTheme } from '@mui/material/styles';
import Login from "./Login";
import Register from "./Register";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../Store";
import { AuthState } from "./AuthInterface";
import { useSnackbar } from "../../commons/Snackbar/Snackbar";

const Auth: React.FC = () => {
    const muiTheme = muiUseTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const apiStatus: AuthState["apiStatus"] = useAppSelector((state: RootState) => state.auth.apiStatus);
    const sessionUser = useAppSelector((state: RootState) => state.auth.sessionUser);

    useEffect(() => {
        if (apiStatus.message) {
            showSnackbar(true, apiStatus.isError ? "error" : apiStatus.isSuccess ? "success" : "warning", apiStatus.message, 4000);
            dispatch({ type: "auth/resetStatusState" });
        }
    }, [apiStatus.message]);

    useEffect(() => {
        if (sessionUser?.id) {
            navigate('/manage-session');
        }
    }, [sessionUser?.id]);

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="20vh"
                width="100%"
                textAlign="center"
                p={2}
            >
                <Typography
                    variant={isMobile ? "h4" : "h3"}
                    sx={{
                        fontStyle: 'italic',
                        fontWeight: 700,
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: isMobile ? '50' : '90px',
                        color: muiTheme.palette.mode == "dark" ? "#fff" : "",
                    }}
                >
                    team-pulse
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 400,
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: isMobile ? '16px' : '25px',
                        fontStyle: "italic",
                        color: muiTheme.palette.text.secondary,
                    }}
                >
                    Collaboration tool for online Q&A and Poll
                </Typography>
            </Box>
            <Box
                display="flex"
                height="80vh"
                width="100%"
                justifyContent="center"
                alignItems="center"
            >
                <Box
                    display={!isMobile ? "flex" : "grid"}
                    width="100%"
                    height="100%"
                    borderRadius={2}
                    boxShadow="0px 3px 6px rgba(0, 0, 0, 0.2)"
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
