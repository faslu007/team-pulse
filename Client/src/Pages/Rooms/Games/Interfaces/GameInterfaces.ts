import { apiStatus } from "../../../../CommonInterfaces";

export interface GameBasic {
    _id: any;
    id?: string,
    gameName?: string,
    roomType?: 'game' | 'vote';
    gameBeginsAt?: Date | null | string;
    gameEndsAt?: Date | null | string;
    invitationMessage?: string;
    roomStatus?: 'draft' | 'publish' | 'archived';
}

export interface PaginationStates {
    page: number | undefined;
    totalPages: number | undefined;
}

// Define the GameState interface
export interface GameState {
    apiStatus: apiStatus;
    gameBasicData: GameBasic;
    roomsList: Room[],
    roomsListPagination: PaginationStates
}



export interface UpdateInputFieldValuesPayload {
    stateToUpdate: keyof GameState; // This ensures stateToUpdate is a valid key of AuthState
    field: string; // You can further restrict this type if you know the specific fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}


export interface Room {
    _id: string;
    roomName: string;
    roomType: string;
    roomStatus: string;
    roomStartsAt: string;
    roomExpiresAt: string;
    adminUsers: string[];
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    invitationMessage?: string
    __v: number;
    firstSlideId?: string;
}