import { apiFetchJson } from "@/api/config/api.config";
import { ApiResponse } from "@/types/api.types";
import { Food } from "@/types/foods.types";
import {
    ApiFoodLogDay,
    ApiWeekConsumed,
    ApiWeekResponse,
    MonthlyStats,
    NewFoodEntry,
    UpdateFoodEntry,
} from "@/types/tracking.types";

export const getFoodLog = async (date: string) =>
    apiFetchJson<ApiResponse<ApiFoodLogDay>>(`/food-log?date=${date}`, { method: "GET" });

export const getFoodLogWeek = async (start: string) =>
    apiFetchJson<ApiResponse<ApiWeekResponse | ApiWeekConsumed[]>>(`/food-log/week?start=${start}`, {
        method: "GET",
    });

export const getRecentFoods = async (limit = 10) =>
    apiFetchJson<ApiResponse<Food[]>>(`/food-log/recent?limit=${limit}`, { method: "GET" });

export const getMonthlyStats = async (month: string) =>
    apiFetchJson<ApiResponse<MonthlyStats>>(`/food-log/stats?month=${month}`, { method: "GET" });

export const addFoodLogEntry = async (entry: NewFoodEntry) =>
    apiFetchJson("/food-log", { method: "POST", json: entry });

export const updateFoodLogEntry = async (id: number, changes: UpdateFoodEntry) =>
    apiFetchJson(`/food-log/${id}`, { method: "PATCH", json: changes });

export const deleteFoodLogEntry = async (id: number) =>
    apiFetchJson(`/food-log/${id}`, { method: "DELETE" });
