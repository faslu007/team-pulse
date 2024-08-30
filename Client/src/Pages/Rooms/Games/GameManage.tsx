import { TabContext, TabList, TabPanel } from "@mui/lab"
import { Paper, Tab } from "@mui/material"
import { useState } from "react";
import GameBasic from "./GameBasic";
import { useAppSelector } from "../../../hooks";
import { GameBasic as GameBasicInterface } from "./Interfaces/GameInterfaces";
import { RootState } from "../../../Store";

function GameManage() {
    const gameBasicInputData: GameBasicInterface = useAppSelector((state: RootState) => state.gameManage.gameBasicData);

    const [tabValue, setTabValue] = useState('1');

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
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
                    <Tab label="Content" value="2" disabled={!gameBasicInputData.id} />
                    <Tab label="Participants" value="3" disabled={!gameBasicInputData.id} />
                </TabList>

                <TabPanel
                    value="1"
                    sx={{
                        width: '100%',
                    }}
                >
                    <GameBasic />
                </TabPanel>
                <TabPanel value="2">Item Two</TabPanel>
            </TabContext>
        </Paper>
    )
}

export default GameManage