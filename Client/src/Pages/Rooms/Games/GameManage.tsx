import { TabContext, TabList, TabPanel } from "@mui/lab"
import { Grid, Pagination, Paper, Tab } from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react";
import GameBasic from "./GameBasic";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { GameBasic as GameBasicInterface, Room } from "./Interfaces/GameInterfaces";
import { RootState } from "../../../Store";
import TableComponent from "../../../commons/Table/Table";
import { getRooms } from "./GameThunk";
import { updateInputFieldValues } from "./GameSlices";


const tableColumns = [
    { field: "roomName", header: "Game Name", type: "text", colSize: "medium" },
    { field: "roomStatus", header: "Game Status", type: "text", colSize: "small" },
    { field: "roomStartsAt", header: "Game Begins at", type: "date", colSize: "medium" },
    { field: "roomExpiresAt", header: "Game Ends at", type: "date", colSize: "medium" },
    { field: "actions", header: "Edit", type: "button", colSize: "small" },
];

function GameManage() {
    const dispatch = useAppDispatch();
    const sessionUser = useAppSelector((state: RootState) => state.auth.sessionUser);
    const gameBasicInputData: GameBasicInterface = useAppSelector((state: RootState) => state.gameManage.gameBasicData);
    const roomsList = useAppSelector((state: RootState) => state.gameManage.roomsList);
    const roomsListPagination = useAppSelector((state: RootState) => state.gameManage.roomsListPagination);

    const [tabValue, setTabValue] = useState('1');

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        if (sessionUser?.id) {
            dispatch(getRooms({
                createdBy: sessionUser.id,
                page: 1,
                pageSize: 5,
            }))
        }
    }, [sessionUser?.id])

    const onEditGameRoom = (row: Room) => {
        const gameState = {
            ...row,
            gameName: row.roomName,
            roomType: row.roomType,
            gameBeginsAt: row.roomStartsAt,
            gameEndsAt: row.roomExpiresAt,
            invitationMessage: row.invitationMessage ?? "",
            roomStatus: row.roomStatus,
        }
        dispatch(updateInputFieldValues({ stateToUpdate: 'gameBasicData', field: 'mainState', value: gameState }))
    }

    const handlePageChange = (e: ChangeEvent<unknown>, newPage: number) => {
        if (sessionUser?.id) {
            dispatch(getRooms({
                createdBy: sessionUser.id,
                page: newPage,
                pageSize: 5,
            }))
        }
    };

    return (
        <Paper
            sx={{
                width: "100%",
                background: 'transparent',
            }}
        >
            <TabContext value={tabValue}>
                <TabList
                    variant="scrollable"
                    onChange={handleTabChange}
                    aria-label="Vertical tabs example"
                    sx={{
                        '& .MuiTab-root': {
                            color: '#fff !important', // White color for the active tab
                            alignItems: 'flex-start', // Align text to the start for better readability
                            padding: '12px 16px', // Add padding for a more spacious feel
                            textTransform: 'none', // Keep text casing as is for better readability
                            fontSize: '1rem', // Slightly larger font for better readability
                            margin: 1,
                        },
                        '& .Mui-disabled': {
                            color: '#7a7a7a !important', // Grey color for the disabled tab
                            backgroundColor: '#2c313e', // Keep the same background as the tab list
                            cursor: 'not-allowed', // Show a not-allowed cursor for disabled tabs
                        },
                    }}
                >
                    <Tab label="Details" value="1" />
                    <Tab label="Content" value="2" disabled={(!gameBasicInputData.id && !gameBasicInputData._id)} />
                    <Tab label="Participants" value="3" disabled={(!gameBasicInputData.id && !gameBasicInputData._id)} />
                </TabList>

                <TabPanel
                    value="1"
                    sx={{
                        width: '100%',
                    }}
                >
                    <GameBasic />
                    <br />
                    <TableComponent
                        data={roomsList || []}
                        columns={tableColumns}
                        onButtonClick={onEditGameRoom}
                    />
                    <br />
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Pagination count={roomsListPagination.totalPages} page={roomsListPagination.page} onChange={handlePageChange} />
                    </Grid>
                </TabPanel>
                <TabPanel value="2">Item Two</TabPanel>
            </TabContext>
        </Paper>
    )
}

export default GameManage