import React, { useState } from 'react';
import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


const GamePresentation: React.FC = () => {
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    const [view, setView] = useState<string>('richText');
    const [text, setText] = useState<string | undefined>();

    const onEditorStateChange = (editorState: EditorState) => {
        setEditorState(editorState);

        const contentState = editorState.getCurrentContent();
        const text = contentState.getPlainText("\u0001");
        setText(text);

        try {
            const rawDraftContentState = JSON.stringify(convertToRaw(contentState));
            console.log(rawDraftContentState);

            // Convert the raw state back to a ContentState object
            const restoredContentState = convertFromRaw(JSON.parse(rawDraftContentState));
            const html = draftToHtml(convertToRaw(contentState));
            console.log(html);
        } catch (error) {
            console.error('Error converting raw content to ContentState:', error);
        }
    };

    const handleToggleChange = (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
        if (newView !== null) {
            setView(newView);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '70vh',
            padding: '16px',
            boxSizing: 'border-box'
        }}>
            {/* Header: Sticks to the top */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                padding: '8px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant='h5' fontWeight={500}>
                    Configure Presentation
                </Typography>
                <ToggleButtonGroup
                    color="primary"
                    value={view}
                    exclusive
                    onChange={handleToggleChange}
                    aria-label="Platform"
                >
                    <ToggleButton value="richText">Rich Text</ToggleButton>
                    <ToggleButton value="Media Content">Media Content</ToggleButton>
                </ToggleButtonGroup>
            </div>

            {/* Content Area: Scrollable */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                margin: '16px 0',
                padding: '8px',
            }}>
                {view === 'richText' ? (
                    <div style={{ minHeight: '500px' }}>
                        <Editor
                            editorState={editorState}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={onEditorStateChange}
                            mention={{
                                separator: " ",
                                trigger: "@",
                                suggestions: [
                                    { text: "APPLE", value: "apple" },
                                    { text: "BANANA", value: "banana", url: "banana" },
                                    { text: "CHERRY", value: "cherry", url: "cherry" },
                                    { text: "DURIAN", value: "durian", url: "durian" },
                                    { text: "EGGFRUIT", value: "eggfruit", url: "eggfruit" },
                                    { text: "FIG", value: "fig", url: "fig" },
                                    { text: "GRAPEFRUIT", value: "grapefruit", url: "grapefruit" },
                                    { text: "HONEYDEW", value: "honeydew", url: "honeydew" }
                                ]
                            }}
                        />
                    </div>
                ) : (
                    <div style={{ minHeight: '500px' }}>
                        {/* Media Content or other content can be rendered here */}
                        Media Content Area
                    </div>
                )}
            </div>

            {/* Footer: Sticks to the bottom */}
            <div style={{
                padding: '8px 0'
            }}>
                Some text
            </div>
        </div>
    );
}

export default GamePresentation;
