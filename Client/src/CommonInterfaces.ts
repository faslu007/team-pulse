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