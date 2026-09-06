import { apiFetchJson } from "@/api/config/api.config";

export const sendContactMessage = async (data: { subject: string; message: string }) =>
    apiFetchJson("/contact", { method: "POST", json: data });
