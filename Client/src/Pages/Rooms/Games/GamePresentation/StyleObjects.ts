import { CSSProperties } from 'react';

export const parentDraftStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '70vh',
    padding: '2px',
    boxSizing: 'border-box',
    maxWidth: '1000px',
    overflow: 'scroll'
};

export const draftHeaderStyle: CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    padding: '2px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}

export const draftContentAreaStyle: CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    margin: '16px 0',
    padding: '5px',
}