import { ApiError, FieldError } from "@/types/api.types";

export const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_URL_API,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
};

export const apiUrl = (endpoint: string) => `${API_CONFIG.baseUrl}${endpoint}`;

export const authHeaders = (token: string, withJson = true): Record<string, string> => ({
    ...(withJson ? API_CONFIG.headers : {}),
    Authorization: `Bearer ${token}`,
});

export const buildApiError = async (response: Response): Promise<never> => {
    const data = await response.json().catch(() => ({}));
    const message = Array.isArray(data.errors)
        ? data.errors.map((e: FieldError) => e.message).join("\n")
        : data.message || data.error || `Erreur ${response.status}`;

    const error = new Error(message) as ApiError;
    error.status = response.status;
    if (data.errors) error.errors = data.errors;
    throw error;
};
