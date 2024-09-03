import { EditorState } from 'draft-js';
import { apiStatus } from '../../../../CommonInterfaces';

export interface Slide {
    _id: string;
    order: number;
    activeContentType: 'richText' | 'mediaContent';
    mediaContentType?: 'audio' | 'video' | 'richText' | 'image';
    mediaContentUri?: string;
    contentTypeExtension?: string;
    richTextContent?: EditorState;
}

export interface PresentationDraftState {
    activeRoomId: string | null;
    activeSlideId: string | null;
    draftSlide: Slide;
    slides: Slide[];
    apiStatus: apiStatus
}

export interface UpdateInputFieldValuesPayload {
    stateToUpdate: keyof PresentationDraftState; // This ensures stateToUpdate is a valid key of AuthState
    field: string; // You can further restrict this type if you know the specific fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}