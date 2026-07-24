import { apiUrl, authHeaders, buildApiError } from "@/api/config/api.config";

export const sendContactMessage = async (
    token: string,
    data: { subject: string; message: string }
) => {
    const response = await fetch(apiUrl("/contact"), {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(data),
    });

    if (!response.ok) await buildApiError(response);
    return await response.json();
};

