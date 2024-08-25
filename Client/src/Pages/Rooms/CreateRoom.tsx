import React, { useState } from "react";
import { Box, Paper, Tab, Tooltip, Typography } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import GameManage from "./Games/GameManage";

const RoomCreate: React.FC = () => {
    const [tabValue, setTabValue] = useState('1');

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    return (
        <Box
            width="100%"
            minHeight="100%"
            mx="auto"
            p={3}
            bgcolor="#2c313e"
            borderRadius={2}
            boxShadow={5}
        >
            <Typography variant="h4" gutterBottom fontWeight={500}>
                Manage Rooms
            </Typography>

            <Paper
                elevation={2}
                sx={{
                    display: 'flex',
                    minHeight: "85%",
                    background: 'transparent',
                    border: "#3f4a5a 2px solid"
                }}
            >
                <TabContext value={tabValue}>
                    <TabList
                        orientation="vertical"
                        variant="scrollable"
                        onChange={handleTabChange}
                        aria-label="Choose Room Type"
                        sx={{
                            padding: 2,
                            borderRight: 1,
                            borderColor: 'divider',
                            width: "12%",
                            minWidth: "150px",
                            backgroundColor: '#2c313e',
                            marginTop: '10px !important',
                            '& .MuiTab-root': {
                                color: '#fff !important', // White color for the active tab
                                alignItems: 'flex-start', // Align text to the start for better readability
                                padding: '12px 16px', // Add padding for a more spacious feel
                                textTransform: 'none', // Keep text casing as is for better readability
                                fontSize: '1rem', // Slightly larger font for better readability
                                margin: 1,
                            },
                            '& .Mui-selected': {
                                color: '#fff', // White color for the active tab
                                backgroundColor: '#3f51b5', // Light blue background for the active tab
                                borderRadius: '8px', // Rounded corners for the active tab
                                marginRight: '6px', // Space between the active tab and the divider
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: 'transparent', // Remove default indicator
                            },
                            '& .MuiTab-root:hover': {
                                backgroundColor: '#3a3f4b', // Slightly lighter background on hover
                                color: '#fff', // White color on hover
                                borderRadius: '8px', // Rounded corners for the active tab
                                marginRight: '6px', // Space between the active tab and the divider
                            },
                            '& .Mui-selected:hover': {
                                backgroundColor: '#3f51b5', // Light blue background for the active tab
                                borderRadius: '8px', // Rounded corners for the active tab
                                marginRight: '6px', // Space between the active tab and the divider
                            },
                            '& .Mui-disabled': {
                                color: '#7a7a7a !important', // Grey color for the disabled tab
                                backgroundColor: '#2c313e', // Keep the same background as the tab list
                                cursor: 'not-allowed', // Show a not-allowed cursor for disabled tabs
                            },
                        }}
                    >
                        <Tab label="Game" value="1" />
                        <Tab label="Vote" value="2" disabled />
                    </TabList>

                    <TabPanel value="1" sx={{ width: '100%', minHeight: "100%" }}>
                        <GameManage />
                    </TabPanel>
                    <TabPanel value="2">Item Two</TabPanel>
                </TabContext>
            </Paper>
        </Box>
    );
};

export default RoomCreate;
