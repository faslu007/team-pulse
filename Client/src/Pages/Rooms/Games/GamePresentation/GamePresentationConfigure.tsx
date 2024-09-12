import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { RootState } from '../../../../Store';
import { PresentationDraftState } from './GamePresentationInterface';
import { draftContentAreaStyle, draftHeaderStyle, parentDraftStyle } from './StyleObjects';
import RichTextEditor from './RichTextEditor';
import SlidesList from './SlidesList';
import MediaContent from './MediaContent';
import { useEffect } from 'react';
import { getDraftSlide, toggleActiveSlideContentType } from './gamePresentationThunk';
import { useSnackbar } from '../../../../commons/Snackbar/Snackbar';

const GamePresentationConfigure: React.FC = () => {
    const dispatch = useAppDispatch();
    const { showSnackbar } = useSnackbar();
    const gamePresentationData: PresentationDraftState = useAppSelector((state: RootState) => state.gamePresentationDraft);
    const apiStatus: PresentationDraftState["apiStatus"] = useAppSelector((state: RootState) => state.gamePresentationDraft.apiStatus);

    const handleToggleChange = (event: React.MouseEvent<HTMLElement>, newView: string) => {
        if (gamePresentationData.activeRoomId && gamePresentationData.activeSlideId) {
            dispatch(toggleActiveSlideContentType({
                roomId: gamePresentationData.activeRoomId,
                slideId: gamePresentationData.activeSlideId,
                activeContentType: newView
            }))
        }
    };

    useEffect(() => {
        if (gamePresentationData.activeRoomId && gamePresentationData.activeSlideId) {
            dispatch(getDraftSlide({ roomId: gamePresentationData.activeRoomId, slideId: gamePresentationData.activeSlideId }))
        }
    }, [gamePresentationData.activeRoomId, gamePresentationData.activeSlideId]);


    useEffect(() => {
        if (apiStatus.message) {
            showSnackbar(true, apiStatus.isError ? "error" : apiStatus.isSuccess ? "success" : "warning", apiStatus.message, 10000);
            dispatch({ type: "gamePresentationDraft/resetStatusState" });
        }
    }, [apiStatus.message]);

    return (
        <div style={parentDraftStyle}>
            {/* Header: Sticks to the top */}
            <div style={draftHeaderStyle}>
                <Typography variant='h5' fontWeight={500}>
                    Configure Presentation
                </Typography>
                <ToggleButtonGroup
                    disabled={apiStatus.isLoading}
                    color="primary"
                    value={gamePresentationData.draftSlide.activeContentType}
                    exclusive
                    onChange={handleToggleChange}
                    aria-label="Platform"
                >
                    <ToggleButton value="richText">Rich Text</ToggleButton>
                    <ToggleButton value="mediaContent">Media Content</ToggleButton>
                </ToggleButtonGroup>
            </div>

            {/* Content Area: Scrollable */}
            <div style={draftContentAreaStyle}>
                {gamePresentationData.draftSlide.activeContentType === 'richText' ? (
                    <RichTextEditor />
                ) : (
                    <div style={{ minHeight: '500px' }}>
                        {/* Media Content or other content can be rendered here */}
                        <MediaContent />
                    </div>
                )}
            </div>

            {/* Footer: Sticks to the bottom */}
            <SlidesList />
        </div >
    );
}

export default GamePresentationConfigure;
