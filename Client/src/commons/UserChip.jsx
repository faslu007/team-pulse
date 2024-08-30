import React, { useState } from 'react';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { stringToColor } from '../utls';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function UserChip({ user, avatarNeeded, avatarOmit }) {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // State to track whether the tooltip should be open (for mobile behavior)
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    if (!user) {
        // User is not defined. Return null or some default content.
        return null;
    }

    const { displayName, firstName, lastName, photoURL } = user;
    const fullName = (firstName && lastName) ? `${firstName} ${lastName}` : displayName;



    const handleTooltipToggle = () => {
        setIsTooltipOpen(!isTooltipOpen);
    };

    const handleTooltipClose = () => {
        setIsTooltipOpen(false);
    };

    const chipContent = (
        <Chip
            avatar={
                ((isMobile && avatarNeeded) || (!isMobile && !avatarOmit)) && (
                    <Avatar
                        alt="User Avatar"
                        src={user.photoURL}
                        style={{
                            backgroundColor: user.photoURL ? 'transparent' : stringToColor(fullName),
                            color: 'white',
                        }}
                    >
                        {(!user.photoURL && (user.displayName || user.firstName)) ? (
                            user.displayName
                                ? user.displayName[0]
                                : user.firstName[0]
                        ) : null}
                    </Avatar>
                )
            }
            label={fullName}
            color="default"
            sx={{
                borderRadius: '10px',
                padding: '4px',
                paddingLeft: 0,
                marginLeft: 0,
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'capitalize',
                backgroundColor: '#CAEDFF',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                '& .MuiChip-avatar': {
                    width: '32px',
                    height: '32px',
                    marginRight: '1px',
                    marginLeft: 0,
                },
            }}
            onClick={handleTooltipToggle} // Toggle the tooltip on click
        />
    );

    return (
        <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip title={fullName} placement="top" arrow open={isTooltipOpen} onClick={handleTooltipToggle}>
                {chipContent}
            </Tooltip>
        </ClickAwayListener>
    );
}

export default UserChip;
