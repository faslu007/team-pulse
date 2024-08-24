import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser } from './AuthThunk';
import { LoginInput, RegisterInput, SessionUser, UpdateInputFieldValuesPayload } from './AuthInterface';

interface AuthState {
    apiStatus: {
        isLoading: boolean;
        isError: boolean;
        isSuccess: boolean;
        message: string;
    };
    sessionUser: SessionUser | null;
    loginInput: LoginInput;
    registerInput: RegisterInput;
}

const initialState: AuthState = {
    apiStatus: {
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: ""
    },
    sessionUser: {
        id: localStorage.getItem('user') || ""
    },
    loginInput: {
        email: "",
        password: ""
    },
    registerInput: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateInputFieldValues: (
            state,
            action: PayloadAction<UpdateInputFieldValuesPayload>
        ) => {
            const { stateToUpdate, field, value } = action.payload;

            if (stateToUpdate in state) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (state[stateToUpdate as keyof AuthState] as any)[field] = value;
            }
        },
        resetStatusState: (state) => {
            state.apiStatus = initialState.apiStatus
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.apiStatus.isLoading = true;
                state.apiStatus.isError = false;
                state.apiStatus.isSuccess = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.sessionUser = action.payload;
                state.apiStatus.isLoading = false;
                state.apiStatus.isSuccess = true;
                state.apiStatus.isError = false;
                state.apiStatus.message = "Logged in successfully.";
                localStorage.setItem("user", action.payload?.id ?? "")
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.apiStatus.isLoading = false;
                state.apiStatus.isError = true;
                state.apiStatus.isSuccess = false;
                state.apiStatus.message = action.payload?.data.error.message ?? "";
            })

            .addCase(registerUser.pending, (state) => {
                state.apiStatus.isLoading = true;
                state.apiStatus.isError = false;
                state.apiStatus.isSuccess = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.sessionUser = action.payload;
                state.apiStatus.isLoading = false;
                state.apiStatus.isSuccess = true;
                state.apiStatus.isError = false;
                state.apiStatus.message = "Registered successfully.";
                localStorage.setItem("user", action.payload?.id ?? "")
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.apiStatus.isLoading = false;
                state.apiStatus.isError = true;
                state.apiStatus.isSuccess = false;
                state.apiStatus.message = action.payload?.data.error.message ?? "";
            });
    }
});

export default authSlice.reducer;
