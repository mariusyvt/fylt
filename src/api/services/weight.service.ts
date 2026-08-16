import { apiUrl, authHeaders, buildApiError } from "@/api/config/api.config";

export const addWeight = async (token: string, weight: number, date: string) => {
    const response = await fetch(apiUrl("/weight"), {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ weight, date }),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const getWeightHistory = async (token: string, months = 3) => {
    const response = await fetch(apiUrl(`/weight?months=${months}`), {
        method: "GET",
        headers: authHeaders(token),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

export const deleteWeight = async (token: string, id: number) => {
    const response = await fetch(apiUrl(`/weight/${id}`), {
        method: "DELETE",
        headers: authHeaders(token, false),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};
