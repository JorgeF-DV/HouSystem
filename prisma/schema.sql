-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('jorge', 'lorena');
CREATE TYPE "TaskStatus" AS ENUM ('available', 'in_progress', 'completed');
CREATE TYPE "TaskFrequency" AS ENUM ('unica', 'semanal', 'mensual');
CREATE TYPE "InvitationStatus" AS ENUM ('pending', 'accepted', 'declined');

-- CreateTable: users
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'jorge',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "partnerId" TEXT,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateTable: partners
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "linkedSince" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable: invitations
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: budget_categories
CREATE TABLE "budget_categories" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    CONSTRAINT "budget_categories_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "budget_categories_partnerId_name_month_year_key" ON "budget_categories"("partnerId", "name", "month", "year");

-- CreateTable: expenses
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "paidById" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable: goals
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable: goal_contributions
CREATE TABLE "goal_contributions" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "contributedById" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "goal_contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: tasks
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "frequency" "TaskFrequency" NOT NULL DEFAULT 'semanal',
    "status" "TaskStatus" NOT NULL DEFAULT 'available',
    "assignedTo" TEXT,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable: events
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT,
    "location" TEXT,
    "price" TEXT,
    "description" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable: recommendations
CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "match" INTEGER NOT NULL,
    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: user_preferences
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "selectedCategories" TEXT[],
    "city" TEXT NOT NULL DEFAULT 'Buenos Aires',
    "priceRange" TEXT NOT NULL DEFAULT 'Hasta $50K',
    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- CreateTable: user_settings
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'Oscuro',
    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "user_settings_userId_key" ON "user_settings"("userId");

-- CreateTable: notifications
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "unread" BOOLEAN NOT NULL DEFAULT true,
    "href" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable: notification_preferences
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "notification_preferences_userId_type_key" ON "notification_preferences"("userId", "type");

-- Foreign Keys
ALTER TABLE "users" ADD CONSTRAINT "users_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "budget_categories" ADD CONSTRAINT "budget_categories_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_paidById_fkey" FOREIGN KEY ("paidById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "goals" ADD CONSTRAINT "goals_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "goal_contributions" ADD CONSTRAINT "goal_contributions_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "goal_contributions" ADD CONSTRAINT "goal_contributions_contributedById_fkey" FOREIGN KEY ("contributedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "events" ADD CONSTRAINT "events_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "events" ADD CONSTRAINT "events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
