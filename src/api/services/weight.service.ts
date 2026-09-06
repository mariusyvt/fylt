import { apiFetchJson } from "@/api/config/api.config";
import { ApiResponse } from "@/types/api.types";
import { WeightEntry } from "@/types/tracking.types";

export const addWeight = async (weight: number, date: string) =>
    apiFetchJson("/weight", { method: "POST", json: { weight, date } });

export const getWeightHistory = async (months = 3) =>
    apiFetchJson<ApiResponse<WeightEntry[]>>(`/weight?months=${months}`, { method: "GET" });

export const deleteWeight = async (id: number) =>
    apiFetchJson(`/weight/${id}`, { method: "DELETE" });
