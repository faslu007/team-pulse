import React, { useCallback, useEffect, useState } from 'react';
import { EditorState, convertToRaw, convertFromRaw, RawDraftContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { RootState } from '../../../../Store';
import { privateApi } from '../../../../api';
import { updateInputFieldValues } from './GamePresentationSlice';

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

function RichTextEditor() {
    const dispatch = useAppDispatch();
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    const { draftSlide, activeRoomId } = useAppSelector((state: RootState) => state.gamePresentationDraft);

    useEffect(() => {
        initializeEditorState();
    }, [draftSlide._id, draftSlide.richTextContent]);

    const initializeEditorState = () => {
        if (draftSlide.richTextContent && draftSlide._id) {
            try {
                const parsedContent = JSON.parse(draftSlide.richTextContent) as RawDraftContentState;
                if (isValidDraftContent(parsedContent)) {
                    const contentState = convertFromRaw(parsedContent);
                    setEditorState(EditorState.createWithContent(contentState));
                } else {
                    console.error('Invalid Draft.js content structure:', parsedContent);
                    setEditorState(EditorState.createEmpty());
                }
            } catch (error) {
                console.error('Error parsing rich text content:', error);
                setEditorState(EditorState.createEmpty());
            }
        } else {
            setEditorState(EditorState.createEmpty());
        }
    };

    const isValidDraftContent = (content: any): content is RawDraftContentState => {
        return content && Array.isArray(content.blocks) && typeof content.entityMap === 'object';
    };

    const onEditorStateChange = (newEditorState: EditorState) => {
        setEditorState(newEditorState);
        const contentState = newEditorState.getCurrentContent();
        const rawDraftContentState = convertToRaw(contentState);
        debouncedUpdateRichTextContext(rawDraftContentState);
    };

    const updateRichTextContextInDb = async (richTextContext: RawDraftContentState) => {
        if (!draftSlide._id) {
            console.error('No slide ID available for update');
            return;
        }

        try {
            const url = `games/${activeRoomId}/slide/${draftSlide._id}/updateRichTextContentState`;
            const stringifiedContent = JSON.stringify(richTextContext);
            await privateApi.put(url, { richTextContent: stringifiedContent });
            dispatch(updateInputFieldValues({ field: 'richTextContent', stateToUpdate: 'draftSlide', value: stringifiedContent }));
        } catch (error) {
            console.error('Error saving rich text content to database:', error);
        }
    };

    const debouncedUpdateRichTextContext = useCallback(
        debounce((updatedState: RawDraftContentState) => {
            updateRichTextContextInDb(updatedState);
        }, 1000),
        [draftSlide._id, activeRoomId]
    );

    return (
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
    );
}

export default RichTextEditor;
