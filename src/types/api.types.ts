export interface FieldError {
    field: string;
    message: string;
}

export interface ApiError extends Error {
    status?: number;
    errors?: FieldError[];
}

