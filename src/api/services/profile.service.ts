import { apiFetchJson } from "@/api/config/api.config";
import { ApiResponse } from "@/types/api.types";
import { Profile } from "@/types/profile.types";

export const getProfile = async () =>
    apiFetchJson<ApiResponse<Profile>>("/user", { method: "GET" });

export const deleteProfile = async () => apiFetchJson("/user", { method: "DELETE" });

export const updateProfile = async (data: { firstName?: string; lastName?: string; email?: string }) =>
    apiFetchJson<ApiResponse<Profile>>("/user", {
        method: "PATCH",
        json: {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
        },
    });

export const updateProfilePhoto = async (file: File) => {
    const formData = new FormData();
    formData.append("photo", file);
    return apiFetchJson<{ data?: { photo_url?: string } }>("/user", { method: "PATCH", body: formData });
};

export interface GoalPayload {
    gender: string;
    age: number;
    weight: number;
    height: number;
    activity_level: string;
    objective: string;
    daily_calories: number;
    daily_proteins: number;
    daily_carbs: number;
    daily_lipids: number;
}

export const updateGoal = async (data: GoalPayload) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
    });
    return apiFetchJson("/user", { method: "PATCH", body: formData });
};

export const updateUserFields = async (
    fields: Record<string, string | number | undefined | null>
) => {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            formData.append(key, String(value));
        }
    });
    return apiFetchJson("/user", { method: "PATCH", body: formData });
};
