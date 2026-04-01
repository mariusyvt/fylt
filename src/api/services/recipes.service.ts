export const getRecipes = async (token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/recipes`, {
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

export const getRecipesTypes = async (token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/recipe-types`, {
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

export const getRecipeById = async (id: number, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/recipes/${id}`, {
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

export const createRecipe = async (recipeData: FormData, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/recipes`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: recipeData,
    });

    if (!response.ok) {
        throw await response.json();
    }

    return await response.json();
}

export const deleteRecipe = async (id: number, token: string) => {
    const response = await fetch (`${process.env.NEXT_PUBLIC_URL_API}/recipes/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })

    if (!response.ok) {
        throw await response.json();
    }

    return await response.json();
}

export const updateRecipe = async (recipeData: FormData, id:number, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/recipes/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: recipeData,
    })

    if (!response.ok) {
        throw await response.json();
    }

    return await response.json();
}