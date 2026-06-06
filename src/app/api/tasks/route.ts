import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/services/tasks-service";
import type { TasksListResponse, TaskCreateResponse, MessageResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requirePartnerAuth();
    const result = await getTasks(user.partnerId);
    return apiSuccess<TasksListResponse>(result);
  } catch (error) {
    return handleApiError(error, "tasks");
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();
    const body = await req.json();
    const result = await createTask(user.partnerId, body);
    return apiSuccess<TaskCreateResponse>(result, 201);
  } catch (error) {
    return handleApiError(error, "tasks");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();
    const id = new URL(req.url).searchParams.get("id") ?? "";
    const body = await req.json();
    const result = await updateTask(user.partnerId, id, body);
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "tasks");
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requirePartnerAuth();
    const id = new URL(req.url).searchParams.get("id") ?? "";
    const result = await deleteTask(user.partnerId, id);
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "tasks");
  }
}
