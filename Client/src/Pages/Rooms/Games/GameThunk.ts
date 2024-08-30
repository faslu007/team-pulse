import { createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../../../api";
import axios, { AxiosError } from "axios";
import { Room } from "./Interfaces/GameInterfaces";

// Payload for creating a room
interface CreateRoomPayload {
    roomName?: string;
    roomType?: 'game' | 'vote';
    roomStatus?: 'draft' | 'publish' | 'archived';
    roomStartsAt?: string | null | Date; // ISO 8601 format for datetime
    roomExpiresAt?: string | null | Date; // ISO 8601 format for datetime
    invitationMessage: string | null
}

interface UpdateRoomPayload extends CreateRoomPayload {
    id: string;
}

// Response structure for successful room creation
interface NewRoomResponseStructure {
    room: {
        roomName: string;
        roomType: 'game' | 'vote';
        roomStatus: 'draft' | 'archived' | 'publish';
        roomStartsAt: string;
        roomExpiresAt: string;
        adminUsers: string[];
        createdBy: string;
        updatedBy: string;
        _id: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
        id: string; // Duplicate of _id
        invitationMessage: string | null
    }
    error: string | null;
    status: number; // HTTP status code
}

// Error response structure for API errors
interface ApiErrorResponse {
    success: false;
    data: null;
    error: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: any;
    };
    status: number; // HTTP status code
}


// Thunk for creating a room
export const createRoom = createAsyncThunk<NewRoomResponseStructure, CreateRoomPayload, { rejectValue: ApiErrorResponse }>(
    'gameManage/createRoom',
    async (createRoomPayload, { rejectWithValue }) => {
        try {
            const response = await privateApi.post<NewRoomResponseStructure>("rooms/createRoom", createRoomPayload);
            return response.data;
        } catch (error) {
            // Handle Axios errors
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiErrorResponse>;
                return rejectWithValue({
                    success: false,
                    data: null,
                    error: {
                        message: axiosError.response?.data?.error?.message || 'An unexpected error occurred.',
                    },
                    status: axiosError.response?.status || 500,
                });
            }
            // Handle any other unexpected errors
            return rejectWithValue({
                success: false,
                data: null,
                error: {
                    message: (error as Error).message || 'An unexpected error occurred.',
                },
                status: 500,
            });
        }
    }
);


export const updateRoom = createAsyncThunk<NewRoomResponseStructure, UpdateRoomPayload, { rejectValue: ApiErrorResponse }>(
    'gameManage/updateRoom',
    async (updateRoomPayload, { rejectWithValue }) => {
        try {
            const response = await privateApi.put<NewRoomResponseStructure>(`rooms/updateRoom/${updateRoomPayload.id}`, updateRoomPayload);
            return response.data;
        } catch (error) {
            // Handle Axios errors
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiErrorResponse>;
                return rejectWithValue({
                    success: false,
                    data: null,
                    error: {
                        message: axiosError.response?.data?.error?.message || 'An unexpected error occurred.',
                    },
                    status: axiosError.response?.status || 500,
                });
            }
            // Handle any other unexpected errors
            return rejectWithValue({
                success: false,
                data: null,
                error: {
                    message: (error as Error).message || 'An unexpected error occurred.',
                },
                status: 500,
            });
        }
    }
);


interface GetRoomsListPayload {
    createdBy?: string,
    page: number,
    pageSize: number,
    roomStatus?: string
}

interface RoomsListResponse {
    message: string;
    result: Room[];
    page: number;
    totalPages: number;
    totalCount: number;
}


export const getRooms = createAsyncThunk<RoomsListResponse, GetRoomsListPayload, { rejectValue: ApiErrorResponse }>(
    'gameManage/getRooms',
    async (getRoomsPayload, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                ...(getRoomsPayload.createdBy && { createdBy: getRoomsPayload.createdBy }),
                page: getRoomsPayload.page.toString(),
                pageSize: getRoomsPayload.pageSize.toString(),
                ...(getRoomsPayload.roomStatus && { roomStatus: getRoomsPayload.roomStatus }),
            });

            const response = await privateApi.get<RoomsListResponse>(`rooms/getRoomsList/?${params.toString()}`);
            return response.data;
        } catch (error) {
            // Handle Axios errors
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiErrorResponse>;
                return rejectWithValue({
                    success: false,
                    data: null,
                    error: {
                        message: axiosError.response?.data?.error?.message || 'An unexpected error occurred.',
                    },
                    status: axiosError.response?.status || 500,
                });
            }
            // Handle any other unexpected errors
            return rejectWithValue({
                success: false,
                data: null,
                error: {
                    message: (error as Error).message || 'An unexpected error occurred.',
                },
                status: 500,
            });
        }
    }
);