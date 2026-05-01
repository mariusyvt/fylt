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

export const signUp = async (lastName: string, firstName: string, email: string, password: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ last_name: lastName, first_name: firstName, email, password }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = data.errors
            ? data.errors.map((e: { message: string }) => e.message).join('\n')
            : data.message || data.error || `Erreur ${response.status}`;
        const error = new Error(message) as Error & { status: number; errors?: { field: string; message: string }[] };
        error.status = response.status;
        if (data.errors) error.errors = data.errors;
        throw error;
    }

    return await response.json();
}

export const forgotPassword = async (email: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const error = new Error(data.message || data.error || `Erreur ${response.status}`) as Error & { status: number };
        error.status = response.status;
        throw error;
    }

    return await response.json();
}

export const resetPassword = async (token: string, newPassword: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const error = new Error(data.message || data.error || `Erreur ${response.status}`) as Error & { status: number };
        error.status = response.status;
        throw error;
    }

    return await response.json();
}

export const verifyEmail = async (token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/verify-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const error = new Error(data.message || data.error || `Erreur ${response.status}`) as Error & { status: number };
        error.status = response.status;
        throw error;
    }

    return await response.json();
}

export const resendVerification = async (email: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/resend-verification`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const error = new Error(data.message || data.error || `Erreur ${response.status}`) as Error & { status: number };
        error.status = response.status;
        throw error;
    }

    return await response.json();
}
