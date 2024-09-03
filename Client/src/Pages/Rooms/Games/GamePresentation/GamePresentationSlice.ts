import { EditorState } from 'draft-js';
import { PresentationDraftState, UpdateInputFieldValuesPayload } from "./GamePresentationInterface";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDraftSlide } from './gamePresentationThunk';

const gamePresentationDraftInitialState: PresentationDraftState = {
    activeRoomId: null,
    activeSlideId: null,
    draftSlide: {
        _id: '',
        order: 0,
        activeContentType: 'mediaContent',
        richTextContent: EditorState.createEmpty(),
    },
    slides: [],
    apiStatus: {
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: ""
    },
};


const gamePresentationDraftSlice = createSlice({
    name: "gamePresentationDraft",
    initialState: gamePresentationDraftInitialState,
    reducers: {
        updateInputFieldValues: (
            state,
            action: PayloadAction<UpdateInputFieldValuesPayload>
        ) => {
            const { stateToUpdate, field, value } = action.payload;

            if (field == 'mainState') {
                state[stateToUpdate] = value;
                return;
            }

            // Ensure the stateToUpdate key exists in the state
            if (stateToUpdate in state) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (state[stateToUpdate as keyof PresentationDraftState] as any)[field] = value;
            }
        },
        resetStatusState: (state) => {
            state.apiStatus = gamePresentationDraftInitialState.apiStatus;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(getDraftSlide.pending, (state) => {
                state.apiStatus.isLoading = true;
                state.apiStatus.isError = false;
                state.apiStatus.isSuccess = false;
            })
            .addCase(getDraftSlide.fulfilled, (state, action) => {
                if (action.payload?.slide) {
                    state.draftSlide = action.payload?.slide;
                    state.apiStatus.isLoading = false;
                    state.apiStatus.isSuccess = true;
                    state.apiStatus.isError = false;
                }
            })
            .addCase(getDraftSlide.rejected, (state, action) => {
                state.apiStatus.isLoading = false;
                state.apiStatus.isError = false;
                state.apiStatus.isSuccess = false;
                state.apiStatus.message = action.payload?.error?.message?.error?.message || 'An error occurred';
            })
    }

});

export const { updateInputFieldValues, resetStatusState } = gamePresentationDraftSlice.actions;

export default gamePresentationDraftSlice.reducer;