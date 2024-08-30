import { getNextTimeWithOffset } from "../../../utls";
import { createRoom, getRooms, updateRoom } from "./GameThunk";
import { UpdateInputFieldValuesPayload, GameState } from "./Interfaces/GameInterfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initialize the state
const gameInitialState: GameState = {
    apiStatus: {
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: ""
    },
    gameBasicData: {
        _id: "",
        id: "",
        gameName: "",
        roomType: "game",
        gameBeginsAt: getNextTimeWithOffset(30),
        gameEndsAt: getNextTimeWithOffset(60),
        invitationMessage: "",
        roomStatus: "draft"
    },
    roomsList: [],
    roomsListPagination: {
        page: 1,
        totalPages: 0
    }
};

const gameManageSlice = createSlice({
    name: "gameManage",
    initialState: gameInitialState,
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
                (state[stateToUpdate as keyof GameState] as any)[field] = value;
            }
        },
        resetStatusState: (state) => {
            state.apiStatus = gameInitialState.apiStatus;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createRoom.pending, (state) => {
                state.apiStatus.isLoading = true;
                state.apiStatus.isError = false;
                state.apiStatus.isSuccess = false;
            })
            .addCase(createRoom.fulfilled, (state, action) => {
                if (action.payload?.room) {
                    state.gameBasicData = {
                        ...action.payload.room,
                        gameBeginsAt: action.payload.room.roomStartsAt,
                        gameEndsAt: action.payload.room.roomExpiresAt,
                        gameName: action.payload.room.roomName,
                        invitationMessage: action.payload.room.invitationMessage ?? ""
                    };
                    state.apiStatus.isLoading = false;
                    state.apiStatus.isSuccess = true;
                    state.apiStatus.isError = false;
                    state.apiStatus.message = "Game created successfully.  Now, you may add contents and participants!!!";
                }
            })
            .addCase(createRoom.rejected, (state, action) => {
                state.apiStatus.isLoading = false;
                state.apiStatus.isError = true;
                state.apiStatus.isSuccess = false;
                // Type assertion to avoid using `any`
                const errorMessage = (action.payload?.error?.message?.error?.message as string) || 'An error occurred while making the request.';

                // Set the state message
                state.apiStatus.message = typeof errorMessage === 'string'
                    ? errorMessage
                    : 'An error occurred while making the request.';
            })

            .addCase(updateRoom.pending, (state) => {
                state.apiStatus.isLoading = true;
                state.apiStatus.isError = false;
                state.apiStatus.isSuccess = false;
            })
            .addCase(updateRoom.fulfilled, (state, action) => {
                if (action.payload?.room) {
                    state.gameBasicData = {
                        ...action.payload.room,
                        gameBeginsAt: action.payload.room.roomStartsAt,
                        gameEndsAt: action.payload.room.roomExpiresAt,
                        gameName: action.payload.room.roomName,
                        invitationMessage: action.payload.room.invitationMessage ?? ""
                    };
                    state.apiStatus.isLoading = false;
                    state.apiStatus.isSuccess = true;
                    state.apiStatus.isError = false;
                    state.apiStatus.message = "Game updated successfully.  Now, you may add contents and participants!!!";
                }
            })
            .addCase(updateRoom.rejected, (state, action) => {
                state.apiStatus.isLoading = false;
                state.apiStatus.isError = true;
                state.apiStatus.isSuccess = false;
                // Type assertion to avoid using `any`
                const errorMessage = (action.payload?.error?.message?.error?.message as string) || 'An error occurred while making the request.';

                // Set the state message
                state.apiStatus.message = typeof errorMessage === 'string'
                    ? errorMessage
                    : 'An error occurred while making the request.';
            })


            .addCase(getRooms.pending, (state) => {
                state.apiStatus.isLoading = true;
                state.apiStatus.isError = false;
                state.apiStatus.isSuccess = false;
            })
            .addCase(getRooms.fulfilled, (state, action) => {
                if (action.payload?.result) {
                    state.roomsList = action.payload?.result;
                    state.apiStatus.isLoading = false;
                    state.apiStatus.isSuccess = true;
                    state.apiStatus.isError = false;
                    state.roomsListPagination.totalPages = action.payload.totalPages;
                    state.roomsListPagination.page = action.payload.page;
                }
            })
            .addCase(getRooms.rejected, (state) => {
                state.apiStatus.isLoading = false;
                state.apiStatus.isError = false;
                state.apiStatus.isSuccess = false;
            })
    }
});

export const { updateInputFieldValues, resetStatusState } = gameManageSlice.actions;
export default gameManageSlice.reducer;
