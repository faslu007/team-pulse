import axios, { AxiosError, AxiosResponse, Method } from 'axios';

const baseURL: string = import.meta.env.VITE_APP_BASE_URL || '';

interface Params {
    [key: string]: string | number | boolean | undefined;
}

interface Data {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // Define a more specific type if possible
}

const api = axios.create({
    withCredentials: true,
    baseURL,
    timeout: 50000,
});

api.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: AxiosError) => {
        throw handleApiError(error);
    }
);

interface ApiConfig {
    method: Method;
    url: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: Record<string, any>;
}

export async function publicApi<T>({ method, url, data, params }: ApiConfig): Promise<AxiosResponse<T>> {
    const response: AxiosResponse<T> = await api({
        method,
        url,
        data,
        params,
    });
    return response;
}

export const privateApi = {
    async request<T>({ method, url, data, params }: ApiConfig): Promise<AxiosResponse<T>> {
        try {
            const response: AxiosResponse<T> = await api({
                method,
                url,
                data,
                params,
                withCredentials: true,
            });
            return response;
        } catch (error) {
            throw handleApiError(error as AxiosError);
        }
    },
    async get<T>(url: string, params?: Params): Promise<AxiosResponse<T>> {
        return this.request<T>({ method: 'GET', url, params });
    },
    async post<T>(url: string, data?: Data, params?: Params): Promise<AxiosResponse<T>> {
        return this.request<T>({ method: 'POST', url, data, params });
    },
    async put<T>(url: string, data?: Data, params?: Params): Promise<AxiosResponse<T>> {
        return this.request<T>({ method: 'PUT', url, data, params });
    },
    async delete<T>(url: string, params?: Params): Promise<AxiosResponse<T>> {
        return this.request<T>({ method: 'DELETE', url, params });
    },
};

function handleApiError(error: AxiosError): { message: string } {
    if (error.response) {
        if (error.response.status === 401) {
            const userId = localStorage.getItem('_id');

            if (userId) {
                localStorage.removeItem('_id');
            }
            localStorage.setItem('isSessionOut', 'true');
            window.location.reload();
        }
        return { message: error.response.data as string };
    } else if (error.request) {
        return { message: 'No response from the server' };
    } else {
        return { message: error.message };
    }
}
