import { prisma } from "@/lib/db";
import { InputError, getOwnedResource } from "@/lib/db-utils";
import { getWeekStart } from "@/lib/utils";
import type { BudgetCategory, Expense, Task } from "@/generated/prisma/client";
import type { ExpensesListResponse, ExpenseCreateResponse, MessageResponse, IncomesListResponse, IncomeCreateResponse, BudgetsListResponse, FinancesResumeResponse, DashboardResponse } from "@/types/api";

type ExpenseEntry = Awaited<ReturnType<typeof prisma.expense.findMany>>[number];
type BudgetCat = Awaited<ReturnType<typeof prisma.budgetCategory.findMany>>[number];

// ─── Expenses ───

export async function getExpenses(partnerId: string, month: number, year: number) {
  const expenses = await prisma.expense.findMany({
    where: { partnerId },
    include: { paidBy: { select: { id: true, name: true, role: true } } },
    orderBy: { date: "desc" },
  });

  const filtered = expenses.filter((e: ExpenseEntry) => {
    const d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const grouped: Record<string, typeof filtered> = {};
  for (const exp of filtered) {
    const day = new Date(exp.date).toLocaleDateString("es-AR", { day: "numeric", month: "long" });
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(exp);
  }

  return {
    expenses: grouped,
    total: filtered.reduce((s: number, e: ExpenseEntry) => s + e.amount, 0),
  } satisfies ExpensesListResponse;
}

export async function createExpense(
  partnerId: string,
  data: { amount: number; description?: string; categoryName: string; paidById: string },
) {
  const { amount, description, categoryName, paidById } = data;
  if (!amount || amount <= 0 || !categoryName || !paidById) {
    throw new InputError("Todos los campos son obligatorios");
  }

  const expense = await prisma.expense.create({
    data: {
      partnerId,
      amount: Math.round(amount),
      description: description ?? "",
      categoryName,
      paidById,
      date: new Date(),
    },
  });

  return { expense } satisfies ExpenseCreateResponse;
}

export async function updateExpense(
  partnerId: string,
  id: string,
  data: { amount?: number; description?: string; categoryName?: string },
) {
  const expense = await getOwnedResource(prisma.expense, id, partnerId);
  const { amount, description, categoryName } = data;
  await prisma.expense.update({
    where: { id },
    data: {
      amount: amount ?? expense.amount,
      description: description ?? expense.description,
      categoryName: categoryName ?? expense.categoryName,
    },
  });

  return { message: "Gasto actualizado" } satisfies MessageResponse;
}

export async function deleteExpense(partnerId: string, id: string) {
  await getOwnedResource(prisma.expense, id, partnerId);
  await prisma.expense.delete({ where: { id } });
  return { message: "Gasto eliminado" } satisfies MessageResponse;
}

// ─── Incomes ───

export async function getIncomes(partnerId: string) {
  const incomes = await prisma.income.findMany({
    where: { partnerId },
    include: { registeredBy: { select: { id: true, name: true, role: true } } },
    orderBy: { date: "desc" },
  });

  const total = incomes.reduce((s, e) => s + e.amount, 0);

  return { incomes, total } satisfies IncomesListResponse;
}

export async function createIncome(partnerId: string, userId: string, data: { amount: number; description?: string }) {
  const { amount, description } = data;
  if (!amount || amount <= 0) throw new InputError("El monto debe ser mayor a 0");

  const income = await prisma.income.create({
    data: {
      partnerId,
      amount: Math.round(amount),
      description: description ?? "",
      registeredById: userId,
    },
  });

  return { income } satisfies IncomeCreateResponse;
}

export async function deleteIncome(partnerId: string, id: string) {
  await getOwnedResource(prisma.income, id, partnerId);
  await prisma.income.delete({ where: { id } });
  return { message: "Ingreso eliminado" } satisfies MessageResponse;
}

// ─── Budgets ───

export async function getBudgets(partnerId: string, month: number, year: number) {
  const budgets = await prisma.budgetCategory.findMany({
    where: { partnerId, month, year },
  });

  return { budgets } satisfies BudgetsListResponse;
}

export async function upsertBudgets(partnerId: string, data: { categories: { name: string; icon?: string; budget: number }[]; month?: number; year?: number }) {
  const { categories } = data;
  if (!Array.isArray(categories)) throw new InputError("Formato inválido");

  const m = data.month ?? new Date().getMonth();
  const y = data.year ?? new Date().getFullYear();

  await prisma.$transaction(
    categories.map((cat: { name: string; icon?: string; budget: number }) =>
      prisma.budgetCategory.upsert({
        where: {
          partnerId_name_month_year: { partnerId, name: cat.name, month: m, year: y },
        },
        create: {
          partnerId, name: cat.name, icon: cat.icon ?? "📦", budget: cat.budget, month: m, year: y,
        },
        update: { budget: cat.budget },
      })
    )
  );

  const budgets = await prisma.budgetCategory.findMany({ where: { partnerId, month: m, year: y } });
  return { budgets } satisfies BudgetsListResponse;
}

export async function deleteBudget(partnerId: string, id: string) {
  await getOwnedResource(prisma.budgetCategory, id, partnerId);
  await prisma.budgetCategory.delete({ where: { id } });
  return { message: "Eliminado" } satisfies MessageResponse;
}

// ─── Finances (resume) ───

export async function getFinancesResume(partnerId: string, month: number, year: number) {
  const categories = await prisma.budgetCategory.findMany({
    where: { partnerId, month, year },
  });

  const expenses = await prisma.expense.findMany({
    where: { partnerId },
  });

  const categoriesWithSpent = categories.map((cat: BudgetCat) => {
    const spent = expenses
      .filter((e: ExpenseEntry) => {
        const d = new Date(e.date);
        return e.categoryName === cat.name && d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum: number, e: ExpenseEntry) => sum + e.amount, 0);
    return { ...cat, spent };
  });

  const memberExpenses = await prisma.expense.groupBy({
    by: ["paidById"],
    where: { partnerId },
    _sum: { amount: true },
  });

  const total = memberExpenses.reduce((s: number, e: { _sum: { amount: number | null } }) => s + (e._sum.amount ?? 0), 0);

  const members = await prisma.user.findMany({
    where: { partnerId },
    select: { id: true, name: true, role: true },
  });

  const perMember = members.map((m: { id: string; name: string; role: string }) => ({
    userId: m.id,
    name: m.name,
    role: m.role,
    total: memberExpenses.find((e: { paidById: string; _sum: { amount: number | null } }) => e.paidById === m.id)?._sum.amount ?? 0,
  }));

  return { categories: categoriesWithSpent, perMember, total, month, year } satisfies FinancesResumeResponse;
}

// ─── Dashboard ───

export async function getDashboard(userId: string, partnerId: string | null, name: string) {
  if (!partnerId) {
    return {
      greeting: `Buen día, ${name}`,
      date: "",
      budgetSummary: { categories: [], totalSpent: 0, totalBudget: 0, percentUsed: 0 },
      tasks: { available: 0, inProgress: 0, completed: 0, total: 0 },
      todayExpenses: [],
      nextEvent: null,
      totalIncome: 0,
    } satisfies DashboardResponse;
  }

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const categories = await prisma.budgetCategory.findMany({
    where: { partnerId, month, year },
  });

  const monthExpenses = await prisma.expense.findMany({
    where: { partnerId },
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
    where: { partnerId, weekStart: { gte: weekStart, lt: weekEnd } },
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
    where: { partnerId },
    orderBy: { date: "asc" },
  });

  let totalIncome = 0;
  try {
    const monthIncomes = await prisma.income.findMany({ where: { partnerId } });
    totalIncome = monthIncomes
      .filter((inc: { date: Date }) => {
        const d = new Date(inc.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum: number, inc: { amount: number }) => sum + inc.amount, 0);
  } catch {}

  return {
    greeting: `Buen día, ${name}`,
    date: todayStr,
    budgetSummary: {
      categories: categoriesWithSpent,
      totalSpent,
      totalBudget,
      percentUsed: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
    },
    tasks: { available: availableTasks.length, inProgress: inProgressTasks.length, completed: completedTasks.length, total: tasks.length },
    todayExpenses,
    nextEvent,
    totalIncome,
  } satisfies DashboardResponse;
}
