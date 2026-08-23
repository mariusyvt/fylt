export interface FieldError {
    field: string;
    message: string;
}

export interface ApiError extends Error {
    status?: number;
    errors?: FieldError[];
}


/** Enveloppe standard des reponses API : { data: ... }. */
export interface ApiResponse<T> {
    data: T;
}
