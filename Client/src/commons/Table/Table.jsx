import { useEffect, useRef } from "react";
import {
    Avatar,
    Button,
    Tooltip,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Skeleton,
    Typography,
    AvatarGroup,
    IconButton,
    Chip
} from "@mui/material";
import "./table.css"; // Import your custom CSS file
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { stringToColor } from "../../utls";
import UserChip from "../UserChip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import moment from 'moment';
import RoomStatusChip from "../RoomStatusChip";

const TableComponent = ({
    data = null,
    columns = null,
    mobileOnlyColumns = null,
    isLoading = false,
    hover = true,
    striped = true,
    onButtonClick,
    onLinkClick,
    autoTableHeight,
    firstColumnSticky
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const tableRef = useRef(null);

    const iconMapping = {
        ErrorOutlineRoundedIcon: <ErrorOutlineRoundedIcon />,
        // add other icons to the mapping as needed
    };


    useEffect(() => {
        const adjustTableHeight = () => {
            const windowHeight = window.innerHeight;
            const tableContainer = tableRef.current;

            if (tableContainer && !autoTableHeight) {
                const rect = tableContainer.getBoundingClientRect();
                const offset = rect.top;
                const maxHeight = windowHeight - offset - 100; // Adjust as needed

                tableContainer.style.maxHeight = `${maxHeight}px`;
            } else {
                tableContainer.style.maxHeight = `auto`;
            }
        };

        adjustTableHeight();
        window.addEventListener("resize", adjustTableHeight);

        return () => {
            window.removeEventListener("resize", adjustTableHeight);
        };
    }, []);

    const getCaps = (head, field) => {
        if (head) return head.toUpperCase();
        return field.toUpperCase();
    };

    const renderCell = (row, col, headerName) => {
        if (col.type === "avatar") {
            return (
                <Avatar
                    alt="User Avatar"
                    src={row.photoURL} // src attribute will render the avatar from the photoURL if available
                    style={{
                        backgroundColor: row.photoURL
                            ? 'transparent'
                            : row.displayName
                                ? stringToColor(row.displayName)
                                : stringToColor(`${row.firstName} ${row.lastName}`),
                    }}
                >
                    {/* Only render initial character if photoURL is not available and displayName or firstName is available */}
                    {(!row.photoURL && (row.displayName || row.firstName)) ? (
                        row.displayName
                            ? row.displayName[0]
                            : row.firstName[0]
                    ) : null}
                </Avatar>
            );
        } else if (col.field === 'displayName') {
            return (
                <UserChip user={row} />
            )
        } else if (col.type === 'user') {
            return (
                <UserChip user={row[col.field]} avatarNeeded={true} />
            )
        } else if (col.type === "date") {
            if (row[col.field] === null) return '';
            const date = new Date(row[col.field]);

            // Format date and time with AM/PM according to user's local time zone
            const formattedDate = date.toLocaleString('en-IN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true, // Ensures AM/PM format
            });

            let backgroundColor = '#e0e0e0';
            if (col.isWarningIndicationNeeded) {
                let warningDuration = col.warningDuration; // will be number
                let dueDate = moment(date);
                let now = moment();

                if (now.isSameOrAfter(dueDate)) {
                    backgroundColor = '#ffb3b3'; // Red for past due or due today
                } else if (now.isAfter(dueDate.subtract(warningDuration, 'days'))) {
                    backgroundColor = '#ffe4b3'; // Orange for about to due
                } else {
                    backgroundColor = '#8ea3be'; // Green for normal color
                }
            }

            const chipStyle = { backgroundColor: backgroundColor, color: '#000', borderRadius: '8px' };
            return (
                <Tooltip title={headerName} arrow position={'top'} enterTouchDelay={0} leaveTouchDelay={2000} disablePortal>
                    <Chip label={formattedDate} style={chipStyle} />
                </Tooltip>
            );
        } else if (col.type === "iconBtn") {
            const IconComponent = iconMapping[col.icon];
            if (col.field === 'actionRequiredItems') {
                return (
                    row[col.field].length > 0 ?
                        <IconButton onClick={() => onButtonClick(row, col?.actionType, col.field)} color={col.color}>
                            {IconComponent}
                        </IconButton>
                        : null
                );
            } else {
                return (
                    <IconButton onClick={() => onButtonClick(row, col?.actionType, col.field)} color={col.color}>
                        {IconComponent}
                    </IconButton>
                );
            }
        } else if (col.type === "button") {
            const icon = col?.actionType === 'delete' ? faTrash : faPen;
            return (
                <Button onClick={() => onButtonClick(row, col?.actionType)}>
                    <FontAwesomeIcon icon={icon} />
                </Button>
            );
        } else if (col.field === 'roomStatus') {
            return (
                <RoomStatusChip roomStatus={row.roomStatus} />
            )
        } else if (col.type === "linkText") {
            const content = row[col.field]
            return (
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: '#1769aa', // Use the primary color for links (blue by default)
                        textDecoration: 'none',
                        transition: 'text-decoration 0.2s ease-in-out',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                            textDecoration: 'underline',
                        },
                    }}
                    onClick={() => { onLinkClick(row, col.field) }}
                >
                    {content}
                </Typography>
            )
        } else if (col.type === "usersStack") {
            const users = row[col.field];
            return (
                <Tooltip title={users?.map((user) => user.displayName || `${user.firstName} ${user.lastName}`).join(', ')} arrow>
                    <AvatarGroup max={3}>
                        {users?.map((user) => {
                            const { displayName, firstName, lastName, photoURL, _id } = user;
                            return (
                                <Avatar
                                    key={_id}
                                    alt="User Avatar"
                                    src={photoURL}
                                    sx={{
                                        width: '32px',
                                        height: '32px',
                                        backgroundColor: photoURL ? 'transparent' : stringToColor((firstName && lastName) ? `${firstName} ${lastName}` : displayName),
                                        color: 'white',
                                        cursor: 'pointer',
                                        zIndex: 1,
                                    }}
                                    onClick={() => {/* Handle click event */ }}
                                >
                                    {(!photoURL && (displayName || firstName)) ? (
                                        displayName
                                            ? displayName[0]
                                            : firstName[0]
                                    ) : null}
                                </Avatar>
                            )
                        })}
                    </AvatarGroup>
                </Tooltip>
            )
        } else if (col.type === "text") {
            const content = row[col.field];
            if (content?.length > 20) {
                return (
                    <Tooltip title={content} placement="top">
                        <span className="trimmed-text">{content}</span>
                    </Tooltip>
                );
            } else {
                return <span>{content}</span>;
            }
        } else {
            return row[col.field];
        }
    };

    const renderColumns = isMobile ? mobileOnlyColumns : columns;

    return (
        <TableContainer component={Paper} sx={{ padding: 0, border: 'none' }} className="table-container">
            <div className="table-scroll custom-scrollbar" ref={tableRef}>
                <Table className="custom-table">
                    <TableHead>
                        <TableRow>
                            {renderColumns?.map((head, index) => (
                                <TableCell
                                    key={index}
                                    className={`header-cell ${head.colSize} ${isMobile ? 'mobile-font' : 'desktop-font'} ${firstColumnSticky && index === 0 ? 'sticky-column' : ''} `} // Apply column size class
                                >
                                    <span className="header-text">{getCaps(head.header, head.field)}</span>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            // Render skeleton loading state
                            [...Array(10)].map((_, index) => (
                                <TableRow key={index}>
                                    {renderColumns.map((_, colIndex) => (
                                        <TableCell key={colIndex}>
                                            <Skeleton />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            // Render data or "No Row to show" message
                            data?.map((row, rowIndex) => (
                                <TableRow key={rowIndex} className={`${hover && "hover"} ${striped && "striped"}`}>
                                    {renderColumns.map((col, colIndex) => (
                                        <TableCell
                                            key={colIndex}
                                            className={`data-cell ${col.colSize} ${isMobile ? 'mobile-font' : 'desktop-font'} ${firstColumnSticky && colIndex === 0 ? 'sticky-column' : ''} ${isMobile && firstColumnSticky && colIndex === 0 ? 'sticky-column-background' : ''}`}
                                        >
                                            {renderCell(row, col, getCaps(col.header, col.field))}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            {!isLoading && (!data || data.length === 0) && <p className="no-data">No Row to show :)</p>}
        </TableContainer>
    );
};

export default TableComponent;