-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('TRIAL', 'TEAM', 'AGENCY');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "SituationType" AS ENUM ('NORMAL', 'VALIDATION', 'RISK', 'DELAY', 'ARBITRAGE', 'PRE_COPIL');

-- CreateEnum
CREATE TYPE "DecisionStatus" AS ENUM ('PENDING', 'DECIDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RiskSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RiskStatus" AS ENUM ('OPEN', 'MONITORING', 'MITIGATED', 'RESOLVED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'TRIAL',
    "seats" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "name" TEXT,
    "organizationId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "masterProfileId" TEXT NOT NULL,
    "objectives" TEXT[],
    "sponsorName" TEXT,
    "sponsorRole" TEXT,
    "sponsorEmail" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "constraints" TEXT[],
    "vocabulary" JSONB NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Update" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "weekNumber" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "facts" JSONB NOT NULL,
    "decisionsNeeded" JSONB NOT NULL,
    "risksInput" JSONB NOT NULL,
    "rawInput" TEXT,
    "situationType" "SituationType" NOT NULL,
    "emailSubject" TEXT NOT NULL,
    "emailBody" TEXT NOT NULL,
    "slackMessage" TEXT NOT NULL,
    "generatedWith" TEXT NOT NULL,
    "tokensUsed" INTEGER,
    "generationTimeMs" INTEGER,
    "wasCopied" BOOLEAN NOT NULL DEFAULT false,
    "wasSent" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Update_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "updateId" TEXT,
    "description" TEXT NOT NULL,
    "context" TEXT,
    "outcome" TEXT,
    "decidedBy" TEXT,
    "decidedAt" TIMESTAMP(3),
    "tags" TEXT[],
    "status" "DecisionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Risk" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "updateId" TEXT,
    "description" TEXT NOT NULL,
    "impact" TEXT NOT NULL,
    "mitigation" TEXT,
    "identifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewDate" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "severity" "RiskSeverity" NOT NULL,
    "status" "RiskStatus" NOT NULL DEFAULT 'OPEN',
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Risk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationSettings" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "dataRetentionDays" INTEGER NOT NULL DEFAULT 365,
    "autoRedaction" BOOLEAN NOT NULL DEFAULT false,
    "storeRawInput" BOOLEAN NOT NULL DEFAULT true,
    "customApiKey" TEXT,
    "preferredProvider" TEXT NOT NULL DEFAULT 'anthropic',
    "weeklyReminderEnabled" BOOLEAN NOT NULL DEFAULT true,
    "weeklyReminderDay" INTEGER NOT NULL DEFAULT 5,
    "weeklyReminderHour" INTEGER NOT NULL DEFAULT 9,
    "exportBranding" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageLog" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "tokensUsed" INTEGER,
    "modelUsed" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Organization_plan_idx" ON "Organization"("plan");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "Project_organizationId_archived_idx" ON "Project"("organizationId", "archived");

-- CreateIndex
CREATE INDEX "Project_createdById_idx" ON "Project"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "MasterProfile_slug_key" ON "MasterProfile"("slug");

-- CreateIndex
CREATE INDEX "MasterProfile_slug_idx" ON "MasterProfile"("slug");

-- CreateIndex
CREATE INDEX "MasterProfile_isCustom_idx" ON "MasterProfile"("isCustom");

-- CreateIndex
CREATE INDEX "Update_projectId_createdAt_idx" ON "Update"("projectId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Update_createdById_idx" ON "Update"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "Update_projectId_year_weekNumber_key" ON "Update"("projectId", "year", "weekNumber");

-- CreateIndex
CREATE INDEX "Decision_projectId_createdAt_idx" ON "Decision"("projectId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Decision_projectId_status_idx" ON "Decision"("projectId", "status");

-- CreateIndex
CREATE INDEX "Decision_updateId_idx" ON "Decision"("updateId");

-- CreateIndex
CREATE INDEX "Risk_projectId_status_createdAt_idx" ON "Risk"("projectId", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Risk_projectId_severity_idx" ON "Risk"("projectId", "severity");

-- CreateIndex
CREATE INDEX "Risk_updateId_idx" ON "Risk"("updateId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationSettings_organizationId_key" ON "OrganizationSettings"("organizationId");

-- CreateIndex
CREATE INDEX "UsageLog_organizationId_createdAt_idx" ON "UsageLog"("organizationId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "UsageLog_userId_createdAt_idx" ON "UsageLog"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "UsageLog_action_idx" ON "UsageLog"("action");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_masterProfileId_fkey" FOREIGN KEY ("masterProfileId") REFERENCES "MasterProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Update" ADD CONSTRAINT "Update_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Update" ADD CONSTRAINT "Update_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_updateId_fkey" FOREIGN KEY ("updateId") REFERENCES "Update"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Risk" ADD CONSTRAINT "Risk_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Risk" ADD CONSTRAINT "Risk_updateId_fkey" FOREIGN KEY ("updateId") REFERENCES "Update"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationSettings" ADD CONSTRAINT "OrganizationSettings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
