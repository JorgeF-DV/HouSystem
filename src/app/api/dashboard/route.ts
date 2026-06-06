import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import type { BudgetCategory, Expense, Task } from "@/generated/prisma/client";
import { getWeekStart } from "@/lib/utils";

export async function GET() {
  try {
    const user = await requireAuth();
    if (!user.partnerId) return apiSuccess({ greeting: `Buen día, ${user.name}`, date: "", budgetSummary: { categories: [], totalSpent: 0, totalBudget: 0, percentUsed: 0 }, tasks: { available: 0, inProgress: 0, completed: 0, total: 0 }, todayExpenses: [], nextEvent: null });

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const categories = await prisma.budgetCategory.findMany({
      where: { partnerId: user.partnerId, month, year },
    });

    const monthExpenses = await prisma.expense.findMany({
      where: { partnerId: user.partnerId },
    });

    const categoriesWithSpent = categories.map((cat: BudgetCategory) => {
      const spent = monthExpenses
        .filter((e: Expense) => {
          const d = new Date(e.date);
          return e.categoryName === cat.name && d.getMonth() === month && d.getFullYear() === year;
        })
        .reduce((sum: number, e: Expense) => sum + e.amount, 0);
      return { name: cat.name, icon: cat.icon, spent, budget: cat.budget };
    });

    const totalSpent = categoriesWithSpent.reduce((s: number, c: { spent: number; budget: number }) => s + c.spent, 0);
    const totalBudget = categoriesWithSpent.reduce((s: number, c: { spent: number; budget: number }) => s + c.budget, 0);

    const weekStart = getWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const tasks = await prisma.task.findMany({
      where: { partnerId: user.partnerId, weekStart: { gte: weekStart, lt: weekEnd } },
      include: { assignee: { select: { id: true, name: true, role: true } } },
    });

    const availableTasks = tasks.filter((t: Task) => t.status === "available");
    const inProgressTasks = tasks.filter((t: Task) => t.status === "in_progress");
    const completedTasks = tasks.filter((t: Task) => t.status === "completed");

    const todayStr = now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });

    const todayExpenses = monthExpenses
      .filter((e: Expense) => {
        const d = new Date(e.date);
        return d.toDateString() === now.toDateString();
      })
      .slice(0, 3);

    const nextEvent = await prisma.event.findFirst({
      where: { partnerId: user.partnerId },
      orderBy: { date: "asc" },
    });

    let totalIncome = 0;
    try {
      const monthIncomes = await prisma.income.findMany({
        where: { partnerId: user.partnerId },
      });
      totalIncome = monthIncomes
        .filter((inc: { date: Date }) => {
          const d = new Date(inc.date);
          return d.getMonth() === month && d.getFullYear() === year;
        })
        .reduce((sum: number, inc: { amount: number }) => sum + inc.amount, 0);
    } catch {}

    return apiSuccess({
      greeting: `Buen día, ${user.name}`,
      date: todayStr,
      budgetSummary: { categories: categoriesWithSpent, totalSpent, totalBudget, percentUsed: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0 },
      tasks: { available: availableTasks.length, inProgress: inProgressTasks.length, completed: completedTasks.length, total: tasks.length },
      todayExpenses,
      nextEvent,
      totalIncome,
    });
  } catch (error) {
    return handleApiError(error, "dashboard");
  }
}
