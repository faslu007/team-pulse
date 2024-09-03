import React, { useState } from 'react'
import { Reorder, motion } from 'framer-motion';
import { IconButton } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { DeleteOutline } from '@mui/icons-material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';


function SlidesList() {
    const [items, setItems] = useState(Array.from({ length: 3 }, (_, i) => i));
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);
    return (

        <Reorder.Group
            axis="x"
            values={items}
            onReorder={setItems}
            style={{
                padding: '5px 20px',
                overflowX: 'scroll',
                display: 'flex',
                flexDirection: 'row',
                gap: '5px'
            }}
        >
            {items.map((item) => (
                <Reorder.Item
                    key={item} // Unique key for Framer Motion
                    value={item}
                    style={{
                        position: 'relative', // Position relative for the item to place the icons absolutely
                        minWidth: '50px',
                        height: '50px',
                        borderRadius: '4px',
                        border: 'solid 2px white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        cursor: 'grab'
                    }}
                    whileHover={{ scale: 1.2 }}
                    onMouseEnter={() => setHoveredItem(item)}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    {item}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredItem === item ? 1 : 0 }}
                        transition={{ duration: 0.3 }} // Adjust duration as needed
                        style={{
                            position: 'absolute',
                            top: '2px',
                            left: '2px',
                            width: '25%',  // Width is 30% of the parent height
                            height: '25%', // Height is 30% of the parent height
                            color: 'white',
                        }}
                    >
                        <IconButton
                            style={{
                                width: '70%',
                                height: '70%',
                            }}
                            className="delete-icon"
                        >
                            <DeleteOutline
                                fontSize="inherit"
                                sx={{
                                    '&:hover': {
                                        color: '#dc3545', // Apply the hover color here
                                    },
                                }}
                            />
                        </IconButton>
                    </motion.div>

                    {/* Edit Icon - Positioned on the right top */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredItem === item ? 1 : 0 }}
                        transition={{ duration: 0.3 }} // Adjust duration as needed
                        style={{
                            position: 'absolute',
                            top: '2px',
                            right: '10px',
                            width: '25%',  // Width is 30% of the parent height
                            height: '25%', // Height is 30% of the parent height
                            color: 'white',
                        }}
                    >
                        <IconButton
                            style={{
                                width: '70%',
                                height: '70%',
                            }}
                            className="edit-icon"
                        >
                            <EditOutlinedIcon
                                fontSize="inherit"
                                sx={{
                                    '&:hover': {
                                        color: '#1479bb', // Apply the hover color here
                                    },
                                }}
                            />
                        </IconButton>
                    </motion.div>
                </Reorder.Item>
            ))}
            <div
                style={{
                    position: 'relative',
                    minWidth: '50px',
                    height: '50px',
                    borderRadius: '4px',
                    border: 'solid 2px white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                }}
            >
                <IconButton>
                    <AddRoundedIcon fontSize='large' style={{ color: '#1479bb' }} />
                </IconButton>
            </div>
        </Reorder.Group>
    )
}

export default SlidesList