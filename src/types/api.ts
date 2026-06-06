import type {
  BudgetCategory, Expense, Goal, GoalContribution, Income,
  Notification, NotificationPreference, Task, Event, Recommendation,
  UserPreferences, UserSettings,
} from "@/generated/prisma/client";
import type { Partner } from "@/generated/prisma/client";

export type {
  BudgetCategory, Expense, Goal, GoalContribution, Income,
  Notification, NotificationPreference, Task, Event, Recommendation,
  UserPreferences, UserSettings, Partner,
};

export type MessageResponse = { message: string };

// --- Shared user profile shape ---
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  partnerId: string | null;
}

export interface UserWithPartner extends UserProfile {
  partner: Partner | null;
}

export interface UserWithPartnerAndUsers extends UserProfile {
  partner: Partner & { users: { id: string; name: string; role: string }[] } | null;
}

// --- Auth ---
export interface LoginResponse {
  user: { id: string; email?: string; user_metadata?: { name?: string } };
}

export interface RegisterResponse {
  user: { id: string; email?: string; user_metadata?: { name?: string } };
}

export interface AuthMeResponse extends UserWithPartner {}

export interface PartnerStatusResponse {
  invitation: {
    id: string; senderId: string; receiverId: string; status: string; createdAt: Date;
    sender: { id: string; name: string; email: string; role: string };
  } | null;
  partner: (Partner & { users: { id: string; name: string; email: string; role: string }[] }) | null;
}

// --- Shared nested user selector ---
interface UserRef {
  id: string; name: string; role: string;
}

// --- Goals ---
export interface GoalWithSaved extends Goal {
  contributions: GoalContribution[];
  saved: number;
  contributionCount: number;
}

export interface GoalsListResponse {
  goals: GoalWithSaved[];
}

export interface GoalCreateResponse {
  goal: Goal;
}

export interface GoalDetailResponse extends Goal {
  contributions: (GoalContribution & { contributedBy: UserRef })[];
  saved: number;
}

// --- Goal Contributions ---
export interface GoalContributionWithContributor extends GoalContribution {
  contributedBy: UserRef;
}

export interface GoalContributionsListResponse {
  contributions: GoalContributionWithContributor[];
}

export interface GoalContributionCreateResponse {
  contribution: GoalContribution;
}

// --- Incomes ---
export interface IncomeWithRegisteredBy extends Income {
  registeredBy: UserRef;
}

export interface IncomesListResponse {
  incomes: IncomeWithRegisteredBy[];
  total: number;
}

export interface IncomeCreateResponse {
  income: Income;
}

// --- Expenses ---
export interface ExpenseWithPaidBy extends Expense {
  paidBy: UserRef;
}

export type GroupedExpenses = Record<string, ExpenseWithPaidBy[]>;

export interface ExpensesListResponse {
  expenses: GroupedExpenses;
  total: number;
}

export interface ExpenseCreateResponse {
  expense: Expense;
}

// --- Budgets ---
export interface BudgetsListResponse {
  budgets: BudgetCategory[];
}

// --- Finances (resume) ---
export interface BudgetCategoryWithSpent extends BudgetCategory {
  spent: number;
}

export interface MemberSpending {
  userId: string; name: string; role: string; total: number;
}

export interface FinancesResumeResponse {
  categories: BudgetCategoryWithSpent[];
  perMember: MemberSpending[];
  total: number;
  month: number;
  year: number;
}

// --- Tasks ---
export interface TaskWithAssignee extends Task {
  assignee: UserRef | null;
}

export interface TasksListResponse {
  available: TaskWithAssignee[];
  inProgress: TaskWithAssignee[];
  completed: TaskWithAssignee[];
  weekStart: string;
}

export interface TaskCreateResponse {
  task: Task;
}

// --- Events ---
export interface EventWithCreator extends Event {
  createdBy: UserRef;
}

export interface EventsListResponse {
  events: Event[];
}

export interface EventDetailResponse {
  event: EventWithCreator;
}

export interface EventCreateResponse {
  event: Event;
}

export interface CalendarEvent {
  id: string; name: string; date: string; time: string | null;
}

export interface CalendarEventsResponse {
  events: CalendarEvent[];
}

// --- Notifications ---
export interface NotificationsListResponse {
  notifications: Notification[];
}

export interface NotificationPreferencesListResponse {
  preferences: NotificationPreference[];
}

// --- Settings ---
export interface SettingsResponse {
  settings: UserSettings | { theme: string };
}

export interface SettingsUpdateResponse {
  settings: UserSettings;
}

// --- Preferences (recommendations) ---
export interface PreferencesResponse {
  preferences: UserPreferences | { selectedCategories: string[]; city: string; priceRange: string };
}

export interface PreferencesUpdateResponse {
  preferences: UserPreferences;
}

// --- Recommendations ---
export interface RecommendationsListResponse {
  recommendations: Recommendation[];
}

// --- Dashboard ---
export interface DashboardBudgetCategorySummary {
  name: string; icon: string; spent: number; budget: number;
}

export interface BudgetSummary {
  categories: DashboardBudgetCategorySummary[];
  totalSpent: number;
  totalBudget: number;
  percentUsed: number;
}

export interface TaskCounts {
  available: number;
  inProgress: number;
  completed: number;
  total: number;
}

export interface DashboardResponse {
  greeting: string;
  date: string;
  budgetSummary: BudgetSummary;
  tasks: TaskCounts;
  todayExpenses: Expense[];
  nextEvent: Event | null;
  totalIncome: number;
}

// --- Partner ---
export interface PartnerAcceptResponse {
  partner: Partner;
  message: string;
}

// --- Profile ---
export type ProfileResponse = UserWithPartnerAndUsers;
