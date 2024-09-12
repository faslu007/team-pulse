import { Box, Divider, useMediaQuery } from "@mui/material";
import { useTheme as muiUseTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";


import { useAppDispatch, useAppSelector } from "../../hooks";
import { useSnackbar } from "../../commons/Snackbar/Snackbar";
import { RootState } from "../../Store";
import RoomCreate from "./CreateRoom";
import UpcomingEvents from "./UpcomingEvents";



const RoomManage: React.FC = () => {
    const muiTheme = muiUseTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const sessionUser = useAppSelector((state: RootState) => state.auth.sessionUser);



    return (
            <Box
                minHeight="100vh"
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
                        flex={isMobile ? "none" : "0 0 70%"}
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        p={2}
                    >
                        <RoomCreate />
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
                        flex={isMobile ? "none" : "0 0 30%"}
                        display="flex"
                        flexDirection="column"
                    // justifyContent="center"
                    // alignItems="center"
                        p={2}
                    >
                    <UpcomingEvents />
                    </Box>
                </Box>
        </Box>
    );
};

export default RoomManage;
