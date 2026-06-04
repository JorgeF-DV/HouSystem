import { NextResponse } from "next/server";
import { AuthError } from "./auth";

export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function handleApiError(error: unknown, context: string) {
  console.error(`[${context}]`, error);
  if (error instanceof AuthError) {
    return apiError(error.message, error.statusCode);
  }
  return apiError("Error interno del servidor", 500);
}
