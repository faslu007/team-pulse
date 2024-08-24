import { createAsyncThunk } from "@reduxjs/toolkit";
import { publicApi } from "../../../api";
import axios from "axios";
import { RegisterInput } from "./AuthInterface";

// Define the LoginInput and SessionUser types
interface LoginInput {
    email: string;
    password: string;
}

interface SessionUser {
    id: string;
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    displayName?: string;
    photoUrl?: string;
}

// Define ApiError type
interface ApiError {
    data: {
        success: boolean;
        data: null;
        error: {
            message: string;
        };
        status: number;
    }
}

export const loginUser = createAsyncThunk<SessionUser, LoginInput, { rejectValue: ApiError }>(
    'auth/loginUser',
    async (loginPayload: LoginInput, { rejectWithValue }) => {
        try {
            // Perform login API request
            const response = await publicApi<SessionUser>({
                method: "POST",
                url: "users/loginUser",
                data: loginPayload,
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue({
                    data: {
                        success: false,
                        data: null,
                        error: { message: error.response?.data?.error?.message || 'Unknown error' },
                        status: error.response?.status || 500,
                    }
                });
            }
            return rejectWithValue({
                data: {
                    success: false,
                    data: null,
                    error: { message: error.message?.error?.message || 'Unknown error' },
                    status: error.message.status
                }
            });
        }
    }
);




export const registerUser = createAsyncThunk<SessionUser, RegisterInput, { rejectValue: ApiError }>(
    'auth/registerUser',
    async (registerPayload: RegisterInput, { rejectWithValue }) => {
        try {
            // Perform login API request
            const response = await publicApi<SessionUser>({
                method: "POST",
                url: "users/registerUser",
                data: registerPayload,
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue({
                    data: {
                        success: false,
                        data: null,
                        error: { message: error.response?.data?.error?.message || 'Unknown error' },
                        status: error.response?.status || 500,
                    }
                });
            }
            return rejectWithValue({
                data: {
                    success: false,
                    data: null,
                    error: { message: error.message?.error?.message || 'Unknown error' },
                    status: error.message.status
                }
            });
        }
    }
);