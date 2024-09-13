import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Typography, Paper, Grid, Button, Dialog, IconButton, List, ListItem, ListItemText, CircularProgress, useMediaQuery, useTheme, Zoom } from '@mui/material';
import { styled } from '@mui/system';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { socketInstance } from '../../SocketInstance';
import { privateApi } from '../../api';
import { useSnackbar } from '../../commons/Snackbar/Snackbar';

// Styled components
const PresentationArea = styled(Paper)(({ theme }) => ({
    height: '75vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
    overflow: 'hidden',
}));

const BuzzerButton = styled(Button)(({ theme }) => ({
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    boxShadow: theme.shadows[8],
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[12],
    },
    '&:active': {
        transform: 'scale(0.95)',
    },
}));

const ScoreBoard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    marginTop: theme.spacing(3),
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    flexGrow: 1,
    overflowY: 'auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
}));

interface Participant {
    id: string;
    name: string;
    team?: string;
}

interface BuzzerInteraction {
    userId: string;
    userName: string;
    timestamp: Date;
}

interface Score {
    teamId: string;
    teamName: string;
    score: number;
}

interface RoomDetails {
    id: string;
    name: string;
    startsAt: string;
    expiresAt: string;
}

interface ValidateRoomResponse {
    message: string;
    roomDetails: RoomDetails;
}


function LiveEvent() {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const { roomId } = useParams<{ roomId: string }>();
    const [isBuzzerLocked, setIsBuzzerLocked] = useState(true);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [buzzerInteractions, setBuzzerInteractions] = useState<BuzzerInteraction[]>([]);
    const [scores, setScores] = useState<Score[]>([]);
    const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
    const [presentationContent, setPresentationContent] = useState<React.ReactNode>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        if (roomId) {
            validateRoomJoinRequest(roomId);

            socketInstance.emit('joinRoom', roomId);

            socketInstance.on('roomJoined', (data) => {
                console.log('Joined room:', data);
                // Initialize room data here
            });

            socketInstance.on('presentationUpdate', (content) => {
                setPresentationContent(content);
            });

            socketInstance.on('buzzerStateChange', (locked: boolean) => {
                setIsBuzzerLocked(locked);
            });

            socketInstance.on('buzzerInteraction', (interaction: BuzzerInteraction) => {
                setBuzzerInteractions(prev => [interaction, ...prev].slice(0, 5));
            });

            socketInstance.on('participantsUpdate', (updatedParticipants: Participant[]) => {
                setParticipants(updatedParticipants);
            });

            socketInstance.on('scoresUpdate', (updatedScores: Score[]) => {
                setScores(updatedScores);
            });
        }

        return () => {
            socketInstance.emit('leaveRoom', roomId);
            socketInstance.off('roomJoined');
            socketInstance.off('presentationUpdate');
            socketInstance.off('buzzerStateChange');
            socketInstance.off('buzzerInteraction');
            socketInstance.off('participantsUpdate');
            socketInstance.off('scoresUpdate');
        };
    }, [roomId]);


    const validateRoomJoinRequest = async (roomId: string): Promise<void> => {
        try {
            const response = await privateApi.get<ValidateRoomResponse>(`rooms/validateRoomJoinRequest?roomId=${roomId}`);
            if (response.data.roomDetails) {
                const { roomDetails } = response.data;
                document.title = roomDetails.name;

                showSnackbar(true, "success", `You have joined the event  ${roomDetails.name}`, 10000);
            } else {
                throw new Error("An un-expected error occurred.");
            }

        } catch (error) {
            console.error('Error validating room join request:', error);
            showSnackbar(true, "error", "You are accessing an invalid room or you dont have suffecient permission to join this event or room.", 10000);
            navigate('/');
        }
    };


    const handleBuzzerClick = () => {
        if (!isBuzzerLocked) {
            socketInstance.emit('buzzerClick', roomId);
        }
    };

    const handleAdminControlsOpen = () => {
        setIsAdminDialogOpen(true);
    };

    const renderScoreBoard = () => (
        <ScoreBoard>
            <Typography variant="h5" gutterBottom fontWeight="bold">Score Board</Typography>
            <Grid container spacing={3}>
                {scores.map((score) => (
                    <Grid item xs={6} sm={4} md={3} key={score.teamId}>
                        <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
                            <Typography variant="subtitle1" noWrap fontWeight="medium">{score.teamName}</Typography>
                            <Typography variant="h4" color="primary" fontWeight="bold">{score.score}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </ScoreBoard>
    );

    return (
        <Box sx={{ p: 4, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <PresentationArea>
                        {presentationContent || <CircularProgress size={60} />}
                    </PresentationArea>
                    {!isMobile && renderScoreBoard()}
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                            <Zoom in={true}>
                                <BuzzerButton
                                    variant="contained"
                                    color={isBuzzerLocked ? "error" : "success"}
                                    onClick={handleBuzzerClick}
                                    disabled={isBuzzerLocked}
                                >
                                    {isBuzzerLocked ? (
                                        <LockIcon sx={{ fontSize: 48, mb: 1 }} />
                                    ) : (
                                        <LockOpenIcon sx={{ fontSize: 48, mb: 1 }} />
                                    )}
                                    {isBuzzerLocked ? "Locked" : "Buzz!"}
                                </BuzzerButton>
                            </Zoom>
                        </Box>
                        <SectionPaper>
                            <Typography variant="h6" gutterBottom fontWeight="bold">Buzzer Interactions</Typography>
                            <List>
                                {buzzerInteractions.map((interaction, index) => (
                                    <ListItem key={index} sx={{ py: 1 }}>
                                        <ListItemText
                                            primary={interaction.userName}
                                            secondary={new Date(interaction.timestamp).toLocaleTimeString()}
                                            primaryTypographyProps={{ fontWeight: 'medium' }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </SectionPaper>
                        <SectionPaper>
                            <Typography variant="h6" gutterBottom fontWeight="bold">Participants</Typography>
                            <List>
                                {participants.map((participant) => (
                                    <ListItem key={participant.id} sx={{ py: 1 }}>
                                        <ListItemText
                                            primary={participant.name}
                                            secondary={participant.team}
                                            primaryTypographyProps={{ fontWeight: 'medium' }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </SectionPaper>
                    </Box>
                </Grid>
                {isMobile && (
                    <Grid item xs={12}>
                        {renderScoreBoard()}
                    </Grid>
                )}
            </Grid>

            <IconButton
                color="primary"
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    width: 72,
                    height: 72,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.shadows[6],
                    '&:hover': { backgroundColor: theme.palette.action.hover },
                }}
                onClick={handleAdminControlsOpen}
            >
                <SettingsIcon fontSize="large" />
            </IconButton>

            <Dialog open={isAdminDialogOpen} onClose={() => setIsAdminDialogOpen(false)}>
                <Typography variant="h6" sx={{ p: 3 }}>Admin Controls</Typography>
                {/* Add admin control options here */}
            </Dialog>
        </Box>
    );
}

export default LiveEvent;
