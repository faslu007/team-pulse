import { createAsyncThunk } from "@reduxjs/toolkit";
import { Slide } from "./GamePresentationInterface";
import { privateApi } from "../../../../api";
import axios, { AxiosError } from "axios";




interface GetDraftSlideResponseStructure {
    message: string;
    slide: Slide;
}

interface GetDraftSlidePayloadStructure {
    roomId: string;
    slideId: string
}

interface ApiErrorResponse {
    success: false;
    data: null;
    error: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: any;
    };
    status: number; // HTTP status code
}

export const getDraftSlide = createAsyncThunk<GetDraftSlideResponseStructure, GetDraftSlidePayloadStructure, { rejectValue: ApiErrorResponse }>(
    'gamePresentationDraft/getDraftSlide',
    async (getDraftSlidePayload, thunkApi) => {
        try {

            const params = new URLSearchParams({
                roomId: getDraftSlidePayload.roomId.toString(),
                slideId: getDraftSlidePayload.slideId.toString()
            });

            const response = await privateApi.get<GetDraftSlideResponseStructure>(`games/getGameSlide/?${params.toString()}`);

            return response.data;
        } catch (error) {
            // Handle Axios errors
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiErrorResponse>;
                return thunkApi.rejectWithValue({
                    success: false,
                    data: null,
                    error: {
                        message: axiosError.response?.data?.error?.message || 'An unexpected error occurred.',
                    },
                    status: axiosError.response?.status || 500,
                });
            }
            // Handle any other unexpected errors
            return thunkApi.rejectWithValue({
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



interface ToggleActiveSlideContentTypeResponse {
    message: string;
    updatedSlide: Slide;
}

interface ToggleActiveSlideContentTypePayload {
    activeContentType: string;
    roomId: string;
    slideId: string;
}


interface ApiErrorResponse {
    success: false;
    data: null;
    error: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: any;
    };
    status: number; // HTTP status code
}

// Define the async thunk
export const toggleActiveSlideContentType = createAsyncThunk<
    ToggleActiveSlideContentTypeResponse, // Type for the response data
    ToggleActiveSlideContentTypePayload, // Type for the payload
    { rejectValue: ApiErrorResponse } // Type for the rejected value
>(
    'gamePresentationDraft/toggleActiveSlideContentType',
    async (payload, thunkApi) => {
        try {
            const url = `games/${payload.roomId}/slide/${payload.slideId}/toggleContentType`;

            const response = await privateApi.put<ToggleActiveSlideContentTypeResponse>(url, {
                activeContentType: payload.activeContentType
            });

            return response.data;
        } catch (error) {
            // Handle Axios errors
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiErrorResponse>;
                return thunkApi.rejectWithValue({
                    success: false,
                    data: null,
                    error: {
                        message: axiosError.response?.data?.error?.message || 'An unexpected error occurred.',
                    },
                    status: axiosError.response?.status || 500,
                });
            }
            // Handle any other unexpected errors
            return thunkApi.rejectWithValue({
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