import { NextResponse } from "next/server";
import { AuthError } from "./auth";
import { NotFoundError } from "./db-utils";

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
  if (error instanceof NotFoundError) {
    return apiError(error.message, 404);
  }
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code: string }).code;
    if (code === "P2002") return apiError("El recurso ya existe", 409);
    if (code === "P2025") return apiError("Recurso no encontrado", 404);
    return apiError("Error de base de datos", 422);
  }
  return apiError("Error interno del servidor", 500);
}
