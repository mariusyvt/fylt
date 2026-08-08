import { apiUrl, authHeaders, buildApiError } from "@/api/config/api.config";

export const getProfile = async (token: string) => {
    const response = await fetch(apiUrl("/user"), {
        method: "GET",
        headers: authHeaders(token),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const deleteProfile = async (token: string) => {
    const response = await fetch(apiUrl("/user"), {
        method: "DELETE",
        headers: authHeaders(token, false),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const updateProfile = async (token: string, data: { firstName?: string; lastName?: string; email?: string }) => {
    const response = await fetch(apiUrl("/user"), {
        method: "PATCH",
        headers: authHeaders(token),
        body: JSON.stringify({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
        }),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const updateProfilePhoto = async (token: string, file: File) => {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await fetch(apiUrl("/user"), {
        method: "PATCH",
        headers: authHeaders(token, false),
        body: formData,
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export interface GoalPayload {
    gender: string;
    age: number;
    weight: number;
    height: number;
    activity_level: string;
    daily_calories: number;
    daily_proteins: number;
    daily_carbs: number;
    daily_lipids: number;
}

export const updateGoal = async (token: string, data: GoalPayload) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
    });

    const response = await fetch(apiUrl("/user"), {
        method: "PATCH",
        headers: authHeaders(token, false),
        body: formData,
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const updateUserFields = async (
    token: string,
    fields: Record<string, string | number | undefined | null>
) => {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            formData.append(key, String(value));
        }
    });

    const response = await fetch(apiUrl("/user"), {
        method: "PATCH",
        headers: authHeaders(token, false),
        body: formData,
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};
