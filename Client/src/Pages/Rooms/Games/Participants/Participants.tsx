import React, { useState, useRef, useEffect } from 'react';
import {
    TextField,
    Button,
    ListItem,
    ListItemText,
    Grid,
    Paper,
    Typography,
    IconButton,
    Box,
    Tooltip,
    Avatar,
    ClickAwayListener,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Autocomplete,
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { styled } from '@mui/system';
import { privateApi } from '../../../../api';
import { PresentationDraftState } from '../GamePresentation/GamePresentationInterface';
import { useAppSelector } from '../../../../hooks';
import { RootState } from '../../../../Store';
import { useSnackbar } from '../../../../commons/Snackbar/Snackbar';
import { socketInstance } from '../../../../SocketInstance';

interface Participant {
    id: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        displayName: string;
    };
    team?: {
        _id: string;
        teamName: string;
    };
}

interface Team {
    id: string;
    teamName: string;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    minWidth: 250,
    minHeight: '500px',
    maxHeight: '500px',
    overflowY: 'scroll',
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

interface SearchUser {
    _id: string;
    customUserId: string;
    firstName: string;
    lastName: string;
    email: string;
}

const ManageParticipants: React.FC = () => {
    const { showSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const gamePresentationData: PresentationDraftState = useAppSelector((state: RootState) => state.gamePresentationDraft);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
    const [allParticipants, setAllParticipants] = useState<Participant[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [teamToDelete, setTeamToDelete] = useState<string | null>(null);

    const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
    const editableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socketInstance.on('updateTeamNameSuccess', ({ teamId, newName }: { teamId: string; newName: string }) => {
            setTeams(prevTeams => prevTeams.map(team =>
                team.id === teamId ? { ...team, teamName: newName } : team
            ));
            showSnackbar(true, "success", "Team name updated successfully.", 3000);
        });

        socketInstance.on('updateTeamNameError', (errorMessage: string) => {
            showSnackbar(true, "error", errorMessage, 3000);
        });

        socketInstance.on('teamNameUpdated', ({ teamId, newName }: { teamId: string; newName: string }) => {
            setTeams(prevTeams => prevTeams.map(team =>
                team.id === teamId ? { ...team, teamName: newName } : team
            ));
        });

        socketInstance.on('deleteTeamSuccess', ({ teamId }: { teamId: string }) => {
            setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
            showSnackbar(true, "success", "Team deleted successfully.", 3000);

            getTeamsList();
            getAllParticipants();
        });

        socketInstance.on('deleteTeamError', (errorMessage: string) => {
            showSnackbar(true, "error", errorMessage, 3000);
        });

        return () => {
            socketInstance.off('updateTeamNameSuccess');
            socketInstance.off('updateTeamNameError');
            socketInstance.off('teamNameUpdated');
            socketInstance.off('deleteTeamSuccess');
            socketInstance.off('deleteTeamError');
            socketInstance.off('teamDeleted');
        };
    }, []);

    const getAllParticipants = async () => {
        try {
            const response = await privateApi.get(`games/${gamePresentationData.activeRoomId}/getAllParticipants`);
            if (response.status === 200 && response.data?.participants) {
                setAllParticipants(response.data.participants);
            }
        } catch (error) {
            console.error('Error fetching all participants:', error);
            showSnackbar(true, "error", "Error fetching all participants.", 3000);
        }
    };

    const getTeamsList = async () => {
        try {
            const response = await privateApi.get(`games/${gamePresentationData.activeRoomId}/getTeamsList`);
            if (response.status === 200 && response.data?.teams) {
                setTeams(response.data.teams);
            }
        } catch (error) {
            console.error('Error fetching teams list:', error);
            showSnackbar(true, "error", "Error fetching teams list.", 3000);
        }
    };

    useEffect(() => {
        getTeamsList();
        setTimeout(() => {
            getAllParticipants();
        }, 500);
    }, [gamePresentationData.activeRoomId]);

    const handleSearch = async (value: string) => {
        setSearchTerm(value);
        if (value.trim().length > 2) {
            try {
                const response = await privateApi.post(`users/search`, { email: value });
                if (response.data && response.data.users) {
                    const filteredUsers = response.data.users.filter((user: SearchUser) =>
                        !allParticipants.some(participant => participant.user.id === user._id)
                    );
                    setSearchResults(filteredUsers);
                }
            } catch (error) {
                console.error('Error searching for users:', error);
                showSnackbar(true, "error", "Error searching for users.", 3000);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleAddParticipant = async (user: SearchUser) => {
        setIsLoading(true);
        try {
            const response = await privateApi.post(`games/addParticipant/${gamePresentationData.activeRoomId}`, {
                userId: user._id
            });
            if (response.status === 200 && response.data?.participant) {
                getAllParticipants();
                showSnackbar(true, "success", "Participant added to game / room successfully.", 3000);
            }
            setSearchTerm('');
            setSearchResults([]);
        } catch (error) {
            console.error('Error adding participant:', error);
            showSnackbar(true, "error", "Error adding participant.", 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const createTeam = async () => {
        setIsLoading(true);
        try {
            const response = await privateApi.post(`games/createTeam/${gamePresentationData.activeRoomId}`, {
                teamName: `Team ${teams.length + 1}`,
            });
            if (response.status === 201 && response.data?.team) {
                setTeams(prev => [...prev, response.data.team]);
                showSnackbar(true, "success", "Team added successfully.", 3000);
            }
        } catch (error) {
            console.error('Error creating team:', error);
            showSnackbar(true, "error", "Error creating team.", 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const onDragEnd = async (result) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        const sourceId = source.droppableId;
        const destId = destination.droppableId;

        const updatedParticipants = [...allParticipants];
        const movedParticipantIndex = updatedParticipants.findIndex(p => p.id === result.draggableId);
        const movedParticipant = updatedParticipants[movedParticipantIndex];

        // Remove from source
        updatedParticipants.splice(movedParticipantIndex, 1);

        // Add to destination
        const destinationIndex = destination.index;
        updatedParticipants.splice(destinationIndex, 0, {
            ...movedParticipant,
            team: destId === 'allParticipants' ? undefined : { _id: destId, teamName: teams.find(t => t.id === destId)?.teamName || '' }
        });

        // Update UI state immediately
        setAllParticipants(updatedParticipants);

        // Send update to server
        try {
            await privateApi.post(`games/${gamePresentationData.activeRoomId}/updateParticipantTeam`, {
                participantId: movedParticipant.user.id,
                newTeamId: destId === 'allParticipants' ? null : destId
            });

            // If the API call is successful, we don't need to do anything else
            // as the UI is already updated
        } catch (error) {
            console.error('Error updating participant team:', error);
            showSnackbar(true, "error", "Error updating participant team. Please try again.", 3000);

            // Revert the state if the server update fails
            getAllParticipants();
        }
    };

    const handleTeamNameEdit = (teamId: string) => {
        setEditingTeamId(teamId);
        setTimeout(() => {
            if (editableRef.current) {
                editableRef.current.focus();
            }
        }, 0);
    };

    const handleTeamNameChange = (teamId: string, newName: string) => {
        if (socketInstance) {
            socketInstance.emit('updateTeamName', {
                roomId: gamePresentationData.activeRoomId,
                teamId: teamId,
                newName: newName
            });
        }
        setEditingTeamId(null);
    };

    const handleDeleteTeam = (teamId: string) => {
        setTeamToDelete(teamId);
        setDeleteConfirmOpen(true);
    };

    const confirmDeleteTeam = () => {
        if (teamToDelete && socketInstance) {
            socketInstance.emit('deleteTeam', {
                roomId: gamePresentationData.activeRoomId,
                teamId: teamToDelete
            });
        }
        setDeleteConfirmOpen(false);
        setTeamToDelete(null);
    };

    return (
        <Box sx={{ maxWidth: '1200px', margin: 'auto', }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Manage Participants
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3, marginTop: 3 }}>
                <Autocomplete
                    freeSolo
                    options={searchResults}
                    getOptionLabel={(option) =>
                        typeof option === 'string' ? option : `${option.firstName} ${option.lastName} (${option.email})`
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search Participants by Email"
                            variant="outlined"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    )}
                    onChange={(event, value) => {
                        if (value && typeof value !== 'string') {
                            handleAddParticipant(value);
                        }
                    }}
                    sx={{ flexGrow: 1, marginRight: 2 }}
                />
                <Tooltip title="Create New Team">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={createTeam}
                        startIcon={<GroupAddIcon />}
                    >
                        Create Team
                    </Button>
                </Tooltip>
            </Box>

            <DragDropContext onDragEnd={onDragEnd}>
                <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', pb: 2 }}>
                    <Grid container spacing={2} wrap="nowrap">
                        <Grid item>
                            <Droppable droppableId="allParticipants">
                                {(provided) => (
                                    <StyledPaper
                                        elevation={3}
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold' }}>All Participants</Typography>
                                        {allParticipants.filter(participant => !participant.team).map((participant, index) => (
                                            <Draggable key={participant.id} draggableId={participant.id} index={index}>
                                                {(provided) => (
                                                    <StyledListItem
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <Avatar sx={{ marginRight: 1, bgcolor: 'primary.main' }}>
                                                            {participant.user.firstName.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <ListItemText primary={participant.user.displayName} />
                                                        <DragIndicatorIcon color="action" />
                                                    </StyledListItem>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </StyledPaper>
                                )}
                            </Droppable>
                        </Grid>

                        {teams.map((team) => (
                            <Grid item key={team.id}>
                                <Droppable droppableId={team.id}>
                                    {(provided) => (
                                        <StyledPaper
                                            elevation={3}
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                                {editingTeamId === team.id ? (
                                                    <ClickAwayListener onClickAway={() => handleTeamNameChange(team.id, editableRef.current?.textContent || team.teamName)}>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                fontWeight: 'bold',
                                                                padding: '5px',
                                                                border: '1px solid #ccc',
                                                                borderRadius: '4px',
                                                                flexGrow: 1,
                                                            }}
                                                            contentEditable
                                                            ref={editableRef}
                                                            onBlur={(e) => handleTeamNameChange(team.id, e.currentTarget.textContent || team.teamName)}
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    handleTeamNameChange(team.id, e.currentTarget.textContent || team.teamName);
                                                                }
                                                            }}
                                                            suppressContentEditableWarning
                                                        >
                                                            {team.teamName}
                                                        </Typography>
                                                    </ClickAwayListener>
                                                ) : (
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            cursor: 'pointer',
                                                            flexGrow: 1,
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                            },
                                                        }}
                                                        onClick={() => handleTeamNameEdit(team.id)}
                                                    >
                                                        {team.teamName}
                                                    </Typography>
                                                )}
                                                <Tooltip title="Delete Team">
                                                    <IconButton
                                                        onClick={() => handleDeleteTeam(team.id)}
                                                        size="small"
                                                        sx={{ color: 'error.main' }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>

                                            {allParticipants.filter(participant => participant.team?._id === team.id).map((participant, index) => (
                                                <Draggable key={participant.id} draggableId={participant.id} index={index}>
                                                    {(provided) => (
                                                        <StyledListItem
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <Avatar sx={{ marginRight: 1, bgcolor: 'secondary.main' }}>
                                                                {participant.user.firstName.charAt(0).toUpperCase()}
                                                            </Avatar>
                                                            <ListItemText primary={participant.user.displayName} />
                                                            <DragIndicatorIcon color="action" />
                                                        </StyledListItem>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </StyledPaper>
                                    )}
                                </Droppable>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </DragDropContext>

            {/* Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Confirm Team Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this team? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDeleteTeam} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageParticipants;
