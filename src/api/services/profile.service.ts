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

export const deleteProfile = async (token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/user`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })

    if (!response.ok) {
        const error = new Error(`Erreur ${response.status}`) as Error & { status: number };
        error.status = response.status;
        throw error;
    }

    return await response.json();
}

export const updateProfile = async (token: string, data: { firstName?: string; lastName?: string; email?: string }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/user`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
        }),
    });

    if (!response.ok) {
        const error = new Error(`Erreur ${response.status}`) as Error & { status: number };
        error.status = response.status;
        throw error;
    }

    return await response.json();
}

export const updateProfilePhoto = async (token: string, file: File) => {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/user`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = new Error(`Erreur ${response.status}`) as Error & { status: number };
        error.status = response.status;
        throw error;
    }

    return await response.json();
}

