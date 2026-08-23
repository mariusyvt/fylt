import { apiFetch, apiFetchJson, apiUrl } from "@/api/config/api.config";

export const signIn = async (email: string, password: string) =>
    apiFetchJson("/signin", { method: "POST", json: { email, password } });

export const signUp = async (
    lastName: string,
    firstName: string,
    email: string,
    gender: string,
    password: string
) =>
    apiFetchJson("/signup", {
        method: "POST",
        json: { last_name: lastName, first_name: firstName, email, gender, password },
    });

export const forgotPassword = async (email: string) =>
    apiFetchJson("/forgot-password", { method: "POST", json: { email } });

export const resetPassword = async (token: string, newPassword: string) =>
    apiFetchJson("/reset-password", { method: "POST", json: { token, newPassword } });

export const verifyEmail = async (token: string) =>
    apiFetchJson("/verify-email", { method: "POST", json: { token } });

export const resendVerification = async (email: string) =>
    apiFetchJson("/resend-verification", { method: "POST", json: { email } });

/** Termine la session cote serveur et efface le cookie httpOnly. */
export const signOut = async (): Promise<void> => {
    await apiFetch("/signout", { method: "POST" });
};

/**
 * Verifie l'existence d'une session valide via le cookie httpOnly.
 * Le cookie n'etant pas lisible en JS, on interroge une route protegee.
 */
export const getSession = async (): Promise<boolean> => {
    try {
        const res = await fetch(apiUrl("/user"), { method: "GET", credentials: "include" });
        return res.ok;
    } catch {
        return false;
    }
};
