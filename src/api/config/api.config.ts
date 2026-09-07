import { ApiError, FieldError } from "@/types/api.types";

export const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_URL_API ?? "",
    timeout: 10000,
};

export const apiUrl = (endpoint: string) => {
    const base = (API_CONFIG.baseUrl || "").replace(/\/$/, "");
    return `${base}${endpoint}`;
};

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

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
    json?: unknown;
    body?: BodyInit | null;
}

export const apiFetch = async (endpoint: string, options: ApiFetchOptions = {}): Promise<Response> => {
    const { json, headers, body, ...rest } = options;

    const finalHeaders: Record<string, string> = { ...(headers as Record<string, string> | undefined) };
    let finalBody = body;

    if (json !== undefined) {
        finalHeaders["Content-Type"] = "application/json";
        finalBody = JSON.stringify(json);
    }

    const response = await fetch(apiUrl(endpoint), {
        credentials: "include",
        ...rest,
        headers: finalHeaders,
        body: finalBody,
    });

    if (!response.ok) await buildApiError(response);
    return response;
};

export const apiFetchJson = async <T = unknown>(endpoint: string, options: ApiFetchOptions = {}): Promise<T> => {
    const response = await apiFetch(endpoint, options);
    return response.json();
};
