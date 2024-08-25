import { getNextTimeWithOffset } from "../../../utls";
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
        id: "",
        gameName: "",
        roomType: 1,
        gameBeginsAt: getNextTimeWithOffset(30),
        gameEndsAt: getNextTimeWithOffset(60),
        invitationMessage: "",
        roomStatus: ""
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

            // Ensure the stateToUpdate key exists in the state
            if (stateToUpdate in state) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (state[stateToUpdate as keyof GameState] as any)[field] = value;
            }
        },
        resetStatusState: (state) => {
            state.apiStatus = gameInitialState.apiStatus;
        }
    }
});

export const { updateInputFieldValues, resetStatusState } = gameManageSlice.actions;
export default gameManageSlice.reducer;
