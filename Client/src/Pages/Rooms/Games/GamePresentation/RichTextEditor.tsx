import React, { useState } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';


function RichTextEditor() {
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());


    const onEditorStateChange = (editorState: EditorState) => {
        setEditorState(editorState);

        const contentState = editorState.getCurrentContent();
        const text = contentState.getPlainText("\u0001");
        // setText(text);

        try {
            const rawDraftContentState = JSON.stringify(convertToRaw(contentState));
            console.log(contentState);

            // Convert the raw state back to a ContentState object
            const restoredContentState = convertFromRaw(JSON.parse(rawDraftContentState));
            const html = draftToHtml(convertToRaw(contentState));
            console.log(html);
        } catch (error) {
            console.error('Error converting raw content to ContentState:', error);
        }
    };

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
    )
}

export default RichTextEditor