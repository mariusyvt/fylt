export const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
};

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
        ...options,
        headers: {
            ...API_CONFIG.headers,
            ...options?.headers,
        },
    });

    if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
    return response.json();
};
