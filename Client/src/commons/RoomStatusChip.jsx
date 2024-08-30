import React from 'react';
import Chip from '@mui/material/Chip';
import DraftsIcon from '@mui/icons-material/Drafts';
import PublishIcon from '@mui/icons-material/Publish';
import ArchiveIcon from '@mui/icons-material/Archive';

function RoomStatusChip({ roomStatus }) {
    let label = '';
    let icon = null;
    let backgroundColor = '';
    let iconSize = 20; // Adjust the icon size as needed

    switch (roomStatus) {
        case 'draft':
            label = 'Draft';
            icon = <DraftsIcon style={{ color: 'rgb(0, 0, 0)' }} sx={{ fontSize: iconSize }} />;
            backgroundColor = '#E0E0E0'; // Light Gray
            break;
        case 'publish':
            label = 'Publish';
            icon = <PublishIcon style={{ color: 'rgb(0, 0, 0)' }} sx={{ fontSize: iconSize }} />;
            backgroundColor = '#C8E6C9'; // Light Green
            break;
        case 'archive':
            label = 'Archive';
            icon = <ArchiveIcon style={{ color: 'rgb(0, 0, 0)' }} sx={{ fontSize: iconSize }} />;
            backgroundColor = '#FFE082'; // Light Yellow
            break;
        default:
            label = 'Unknown';
            backgroundColor = '#F5F5F5'; // Lightest Gray for unknown status
            break;
    }

    return (
        <Chip
            label={label}
            icon={icon}
            sx={{
                color: 'rgb(0, 0, 0)',
                borderRadius: '10px',
                padding: '4px 8px',
                fontSize: '14px',
                textTransform: 'capitalize',
                backgroundColor: backgroundColor, // Set the background color based on status
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                '& .MuiChip-icon': {
                    marginRight: '4px',
                },
            }}
        />
    );
}

export default RoomStatusChip;