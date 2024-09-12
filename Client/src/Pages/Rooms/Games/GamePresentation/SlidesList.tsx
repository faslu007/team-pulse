import React, { useEffect, useState } from 'react'
import { Reorder, motion } from 'framer-motion';
import { IconButton, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { DeleteOutline } from '@mui/icons-material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { privateApi } from '../../../../api';
import { PresentationDraftState, Slide } from './GamePresentationInterface';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { RootState } from '../../../../Store';
import { updateInputFieldValues } from './GamePresentationSlice';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import AudiotrackRoundedIcon from '@mui/icons-material/AudiotrackRounded';
import VideoFileRoundedIcon from '@mui/icons-material/VideoFileRounded';
import FormatColorTextRoundedIcon from '@mui/icons-material/FormatColorTextRounded';
import { useSnackbar } from '../../../../commons/Snackbar/Snackbar';
import { convertFromRaw, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

interface CreateSlideResponse {
    newSlide: Slide; // Replace 'Slide' with the actual type of the slide object
}

const renderSlideSnapshot = (contentType, slide) => {
    switch (contentType) {
        case 'richText':
            if (slide.richTextContent) {
                try {
                    const contentState = convertFromRaw(JSON.parse(slide.richTextContent));
                    const editorState = EditorState.createWithContent(contentState);
                    const html = stateToHTML(editorState.getCurrentContent());
                    return (
                        <div style={{
                            maxWidth: '80px',
                            height: '100%',
                            overflow: 'hidden',
                            fontSize: '8px',
                            padding: '2px',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)' // Light green background
                        }}>
                            <div dangerouslySetInnerHTML={{ __html: html }} />
                        </div>
                    );
                } catch (error) {
                    console.error('Error parsing rich text content:', error);
                    return <FormatColorTextRoundedIcon style={{ color: '#4CAF50' }} />;
                }
            }
            return <FormatColorTextRoundedIcon style={{ color: '#4CAF50' }} />;

        case 'image':
            if (slide.mediaContentUri) {
                return (
                    <div style={{
                        width: '80px',
                        height: '100%',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)' // Light blue background
                    }}>
                        <img
                            src={slide.mediaContentUri}
                            alt="Slide preview"
                            style={{
                                maxWidth: '70%',
                                maxHeight: '70%',
                                // objectFit: 'cover'
                            }}
                        />
                    </div>
                );
            }
            return <ImageRoundedIcon style={{ color: '#2196F3' }} />; // Blue for images

        case 'audio':
            return <AudiotrackRoundedIcon style={{ color: '#FF5722' }} />; // Orange for audio

        case 'video':
            return <VideoFileRoundedIcon style={{ color: '#FFC107' }} />; // Yellow for video

        default:
            return null;
    }
};



function SlidesList() {
    const dispatch = useAppDispatch();
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const gamePresentationData: PresentationDraftState = useAppSelector((state: RootState) => state.gamePresentationDraft);

    const [hoveredItem, setHoveredItem] = useState<string | number | null>(null);

    const getSlides = async () => {
        if (gamePresentationData.activeRoomId) {
            try {
                const response = await privateApi.get(`games/getGameSlides?roomId=${gamePresentationData.activeRoomId}`);
                if (response.data?.slides) {
                    dispatch(updateInputFieldValues({ field: 'mainState', stateToUpdate: 'slides', value: response.data.slides }))
                }
            } catch (error) {
                console.error(error)
            }
        }
    }

    useEffect(() => {
        getSlides();
    }, [gamePresentationData.activeRoomId]);


    const onReorder = async (newOrder) => {
        if (loading)
            return;

        // Preserve the old order in case the update fails
        const oldOrder = gamePresentationData.slides;

        // Optimistically update the UI with the new order
        dispatch(updateInputFieldValues({
            field: 'mainState',
            stateToUpdate: 'slides',
            value: newOrder
        }));

        try {
            setLoading(true);
            // Prepare the new order to be sent to the server
            const newOrderToUpdate = newOrder.map((item, index) => ({
                id: item._id,
                order: index
            }));

            // Send the updated order to the server
            const response = await privateApi.put('games/updateGameSlidesOrder', {
                roomId: gamePresentationData.activeRoomId,
                newOrder: newOrderToUpdate
            });

            // Ensure the server responded with the updated slides
            if (!response.data?.slides) {
                throw new Error('Failed to update slide order on the server.');
            }

            // Optionally, handle the response if you need to update the UI further

        } catch (error) {
            // If the update fails, revert to the old order and log the error
            dispatch(updateInputFieldValues({
                field: 'mainState',
                stateToUpdate: 'slides',
                value: oldOrder
            }));
            console.error('Error updating slide order:', error.message || error);
        } finally {
            setLoading(false);
        }
    };


    const addNewSlide = async () => {
        if (loading)
            return;
        try {
            setLoading(true);
            // Ensure that the roomId is available before making the API call
            if (!gamePresentationData.activeRoomId) {
                throw new Error('Active Room ID is not available.');
            }

            // Use the defined response type
            const response = await privateApi.post<CreateSlideResponse>('games/createSlide', { roomId: gamePresentationData.activeRoomId });

            if (response.data.newSlide) {
                // Update the slides state with the new slide
                dispatch(updateInputFieldValues({
                    field: 'mainState',
                    stateToUpdate: 'slides',
                    value: [...gamePresentationData.slides, response.data.newSlide]
                }));

                dispatch(updateInputFieldValues({
                    field: 'mainState',
                    stateToUpdate: 'activeSlideId',
                    value: response.data.newSlide._id
                }));

                dispatch(updateInputFieldValues({
                    field: 'mainState',
                    stateToUpdate: 'draftSlide',
                    value: response.data.newSlide
                }));

                // Notify the user of the successful addition
                showSnackbar(true, 'success', 'New slide has been added successfully.', 10000);
            } else {
                // Handle case where newSlide is not in the response
                showSnackbar(true, 'warning', 'No new slide was returned from the server.', 10000);
            }
        } catch (error) {
            // Log the error and notify the user
            console.error('Error adding new slide:', error);
            showSnackbar(true, 'error', 'An error occurred while adding the new slide.', 10000);
        } finally {
            setLoading(false);
        }
    };

    const onEditSlide = (newActiveSlide) => {
        setLoading(true);
        setTimeout(() => {
            dispatch(updateInputFieldValues({ field: 'richTextContent', stateToUpdate: 'draftSlide', value: newActiveSlide }));

            dispatch(updateInputFieldValues({
                field: 'mainState',
                stateToUpdate: 'activeSlideId',
                value: newActiveSlide._id
            }));
            setLoading(false);
        }, 100);
    }


    const onDeleteSlide = async (slideId) => {
        try {
            setLoading(true);

            const url = `games/${gamePresentationData.activeRoomId}/slide/${slideId}`;

            const response = await privateApi.delete<CreateSlideResponse>(url, {});

            if (response.data.slides) {
                showSnackbar(true, 'success', response.data?.message, 10000);
                dispatch(updateInputFieldValues({ field: 'mainState', stateToUpdate: 'slides', value: response.data.slides }));
                dispatch(updateInputFieldValues({ field: 'mainState', stateToUpdate: 'activeSlideId', value: response.data.slides[0]._id }));

            }
        } catch (error) {
            console.error('Error deleting slide:', error);
            showSnackbar(true, 'error', 'An error occurred while deleting the slide.', 10000);
        } finally {
            setLoading(false);
        }
    }


    return (
        <Reorder.Group
            axis="x"
            values={gamePresentationData.slides}
            onReorder={onReorder}
            style={{
                padding: '5px 20px',
                display: 'flex',
                flexDirection: 'row',
                gap: '5px'
            }}
        >
            {gamePresentationData.slides.map((item) => (
                <Reorder.Item
                    key={item._id} // Unique key for Framer Motion
                    value={item}
                    style={{
                        position: 'relative', // Position relative for the item to place the icons absolutely
                        minWidth: '50px',
                        height: '50px',
                        borderRadius: '4px',
                        border: gamePresentationData.activeSlideId === item._id ? 'solid 2px #007bff' : 'solid 2px white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        cursor: 'grab'
                    }}
                    whileHover={{ scale: 1.2 }}
                    onMouseEnter={() => setHoveredItem(item._id)}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    {renderSlideSnapshot(item.activeContentType === 'mediaContent' ? item.mediaContentType : 'richText', item)}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredItem === item._id ? 1 : 0 }}
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
                            onClick={() => { onDeleteSlide(item._id) }}
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
                        animate={{ opacity: hoveredItem === item._id ? 1 : 0 }}
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
                            onClick={() => { onEditSlide(item) }}
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
                <IconButton
                    onClick={addNewSlide}
                >
                    <AddRoundedIcon fontSize='large' style={{ color: '#1479bb' }} />
                </IconButton>
            </div>
        </Reorder.Group>
    )
}

export default SlidesList