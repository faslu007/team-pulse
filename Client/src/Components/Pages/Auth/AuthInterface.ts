// Define types for each section of your state
export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SessionUser {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    notificationSound?: boolean;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    customUserId?: number | string;
    displayName?: string;
    id?: string;
    photoUrl?: string;
}

export interface LoginResponse {
    user: SessionUser
}


interface apiStatus {
    isLoading: boolean,
    isError: boolean,
    isSuccess: boolean,
    message: string
}

// Define the main state type
export interface AuthState {
    loginInput: LoginInput;
    registerInput: RegisterInput;
    sessionUser: SessionUser;
    apiStatus: apiStatus
}

export interface UpdateInputFieldValuesPayload {
    stateToUpdate: keyof AuthState; // This ensures stateToUpdate is a valid key of AuthState
    field: string; // You can further restrict this type if you know the specific fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}

