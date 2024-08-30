import { apiStatus } from "../../../../CommonInterfaces";

export interface GameBasic {
    id?: string,
    gameName?: string,
    roomType?: 'game' | 'vote';
    gameBeginsAt?: Date | null | string;
    gameEndsAt?: Date | null | string;
    invitationMessage?: string;
    roomStatus?: 'draft' | 'publish' | 'archived';
}

// Define the GameState interface
export interface GameState {
    apiStatus: apiStatus;
    gameBasicData: GameBasic;
}



export interface UpdateInputFieldValuesPayload {
    stateToUpdate: keyof GameState; // This ensures stateToUpdate is a valid key of AuthState
    field: string; // You can further restrict this type if you know the specific fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}