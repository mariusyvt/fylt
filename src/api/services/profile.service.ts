export const getProfiles = async (token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        const error = new Error(`Erreur ${response.status}`) as Error & { status: number };
        error.status = response.status;
        throw error;
    }

    return await response.json();
}