import React, { useEffect, useState } from 'react';
import { privateApi } from '../../api';
import { Box, Typography, Paper, List, ListItem, ListItemText, Button, Chip, CircularProgress, Avatar } from '@mui/material';
import { format } from 'date-fns';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

interface Event {
    _id: string;
    roomName: string;
    invitationMessage: string;
    roomType: string;
    roomStatus: string;
    roomStartsAt: string;
    roomExpiresAt: string;
    adminUsers: string[];
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    hostedByName: string;
    id: string;
    hostedBy: string;
}

type UpcomingEvents = Event[];

function UpcomingEvents() {
    const [upComingEvents, setUpComingEvents] = useState<UpcomingEvents>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getUpcomingEvents();
    }, []);

    const getUpcomingEvents = async () => {
        setIsLoading(true);
        try {
            const response = await privateApi.get<{ events: UpcomingEvents }>('rooms/getUpcomingEvents');
            if (response.status === 200 && response.data.events) {
                setUpComingEvents(response.data.events);
            }
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoin = (eventId: string) => {
        navigate(`/live-event/${eventId}`);
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMM dd, yyyy');
    };

    const formatTime = (dateString: string) => {
        return format(new Date(dateString), 'hh:mm a');
    };

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EventIcon sx={{ mr: 1 }} />
                Upcoming Events
            </Typography>
            <Paper elevation={3} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : upComingEvents.length > 0 ? (
                    <List disablePadding>
                        {upComingEvents.map((event, index) => (
                            <React.Fragment key={event.id}>
                                <ListItem
                                    alignItems="flex-start"
                                    secondaryAction={
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleJoin(event.id)}
                                            sx={{ mt: 1 }}
                                        >
                                            Join
                                        </Button>
                                    }
                                    sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}
                                >
                                    <ListItemText
                                        primary={capitalizeFirstLetter(event.roomName)}
                                        secondary={
                                            <React.Fragment>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatDate(event.roomStartsAt)} at {formatTime(event.roomStartsAt)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        Hosted by: {event.hostedBy}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={capitalizeFirstLetter(event.roomType)}
                                                    size="small"
                                                    sx={{ mt: 1, borderRadius: '8px' }}
                                                    color={event.roomType === 'game' ? 'secondary' : 'default'}
                                                />
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                {index < upComingEvents.length - 1 && <Box sx={{ borderBottom: '1px solid #e0e0e0', mx: 2 }} />}
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            No upcoming events at the moment.
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}

export default UpcomingEvents;
