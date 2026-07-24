import { API_CONFIG, apiUrl, buildApiError } from "@/api/config/api.config";

export const signIn = async (email: string, password: string) => {
    const response = await fetch(apiUrl("/signin"), {
        method: "POST",
        headers: API_CONFIG.headers,
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const signUp = async (lastName: string, firstName: string, email: string, gender: string, password: string) => {
    const response = await fetch(apiUrl("/signup"), {
        method: "POST",
        headers: API_CONFIG.headers,
        body: JSON.stringify({ last_name: lastName, first_name: firstName, email, gender, password }),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const forgotPassword = async (email: string) => {
    const response = await fetch(apiUrl("/forgot-password"), {
        method: "POST",
        headers: API_CONFIG.headers,
        body: JSON.stringify({ email }),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const resetPassword = async (token: string, newPassword: string) => {
    const response = await fetch(apiUrl("/reset-password"), {
        method: "POST",
        headers: API_CONFIG.headers,
        body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const verifyEmail = async (token: string) => {
    const response = await fetch(apiUrl("/verify-email"), {
        method: "POST",
        headers: API_CONFIG.headers,
        body: JSON.stringify({ token }),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const resendVerification = async (email: string) => {
    const response = await fetch(apiUrl("/resend-verification"), {
        method: "POST",
        headers: API_CONFIG.headers,
        body: JSON.stringify({ email }),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};
