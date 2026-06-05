import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";

type BudgetCat = Awaited<ReturnType<typeof prisma.budgetCategory.findMany>>[number];
type ExpenseEntry = Awaited<ReturnType<typeof prisma.expense.findMany>>[number];

export async function GET(req: Request) {
  try {
    const user = await requirePartnerAuth();

    const url = new URL(req.url);
    const month = parseInt(url.searchParams.get("month") ?? String(new Date().getMonth()));
    const year = parseInt(url.searchParams.get("year") ?? String(new Date().getFullYear()));

    const categories = await prisma.budgetCategory.findMany({
      where: { partnerId: user.partnerId, month, year },
    });

    const expenses = await prisma.expense.findMany({
      where: { partnerId: user.partnerId },
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
      where: { partnerId: user.partnerId },
      _sum: { amount: true },
    });

    const total = memberExpenses.reduce((s: number, e: { _sum: { amount: number | null } }) => s + (e._sum.amount ?? 0), 0);

    const members = await prisma.user.findMany({
      where: { partnerId: user.partnerId },
      select: { id: true, name: true, role: true },
    });

    const perMember = members.map((m: { id: string; name: string; role: string }) => ({
      userId: m.id,
      name: m.name,
      role: m.role,
      total: memberExpenses.find((e: { paidById: string; _sum: { amount: number | null } }) => e.paidById === m.id)?._sum.amount ?? 0,
    }));

    return apiSuccess({ categories: categoriesWithSpent, perMember, total, month, year });
  } catch (error) {
    return handleApiError(error, "finances");
  }
}
