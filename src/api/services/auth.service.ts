export const signIn = async (email: string, password: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const error = new Error(data.message || data.error || `Erreur ${response.status}`) as Error & { status: number };
        error.status = response.status;
        throw error;
    }

    return await response.json();
}

export const signUp = async (lastName: string, firstName: string, email: string, name: string, password: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lastName, firstName, email, name, password }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const error = new Error(data.message || data.error || `Erreur ${response.status}`) as Error & { status: number };
        error.status = response.status;
        throw error;
    }

    return await response.json();
}
