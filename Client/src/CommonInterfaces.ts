export interface ApiError {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    message: {
        success: boolean;
        data: null;
        error: {
            message: string;
        };
        status: number;
    }
}


export interface apiStatus {
    isLoading: boolean,
    isError: boolean,
    isSuccess: boolean,
    message: string
}