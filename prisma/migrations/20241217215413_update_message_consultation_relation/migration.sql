/*
  Warnings:

  - A unique constraint covering the columns `[lastMessageId]` on the table `Consultation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `duration` to the `ConsultationSlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EVENT', 'CONSULTATION', 'CAREER_ASSESSMENT', 'MENTOR_RECOMMENDATION', 'OTHER');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ');

-- AlterEnum
ALTER TYPE "ConsultationStatus" ADD VALUE 'CANCELLED';

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_consultationId_fkey";

-- AlterTable
ALTER TABLE "Consultation" ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastMessageAt" TIMESTAMP(3),
ADD COLUMN     "lastMessageId" TEXT,
ADD COLUMN     "mentorNotes" TEXT,
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "review" TEXT;

-- AlterTable
ALTER TABLE "ConsultationSlot" ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxBookings" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "recurringDays" INTEGER[];

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "readAt" TIMESTAMP(3),
ADD COLUMN     "status" "MessageStatus" NOT NULL DEFAULT 'SENT',
ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'CLIENT';

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_token" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "mentorId" TEXT NOT NULL,
    "clientId" TEXT,
    "eventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorExpertise" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorExpertise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorRecommendation" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "matchingScore" DOUBLE PRECISION NOT NULL,
    "matchingCriteria" JSONB NOT NULL,
    "recommendedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isViewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MentorRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "Notification_mentorId_idx" ON "Notification"("mentorId");

-- CreateIndex
CREATE INDEX "Notification_clientId_idx" ON "Notification"("clientId");

-- CreateIndex
CREATE INDEX "Notification_eventId_idx" ON "Notification"("eventId");

-- CreateIndex
CREATE INDEX "MentorExpertise_mentorId_idx" ON "MentorExpertise"("mentorId");

-- CreateIndex
CREATE UNIQUE INDEX "MentorExpertise_mentorId_area_key" ON "MentorExpertise"("mentorId", "area");

-- CreateIndex
CREATE INDEX "MentorRecommendation_clientId_idx" ON "MentorRecommendation"("clientId");

-- CreateIndex
CREATE INDEX "MentorRecommendation_mentorId_idx" ON "MentorRecommendation"("mentorId");

-- CreateIndex
CREATE INDEX "MentorRecommendation_assessmentId_idx" ON "MentorRecommendation"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "MentorRecommendation_clientId_mentorId_assessmentId_key" ON "MentorRecommendation"("clientId", "mentorId", "assessmentId");

-- CreateIndex
CREATE INDEX "Admin_userId_idx" ON "Admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Consultation_lastMessageId_key" ON "Consultation"("lastMessageId");

-- CreateIndex
CREATE INDEX "Consultation_clientId_idx" ON "Consultation"("clientId");

-- CreateIndex
CREATE INDEX "Consultation_mentorId_idx" ON "Consultation"("mentorId");

-- CreateIndex
CREATE INDEX "Consultation_slotId_idx" ON "Consultation"("slotId");

-- CreateIndex
CREATE INDEX "Consultation_lastMessageAt_idx" ON "Consultation"("lastMessageAt");

-- CreateIndex
CREATE INDEX "ConsultationSlot_mentorId_idx" ON "ConsultationSlot"("mentorId");

-- CreateIndex
CREATE INDEX "Event_adminId_idx" ON "Event"("adminId");

-- CreateIndex
CREATE INDEX "Message_consultationId_idx" ON "Message"("consultationId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");

-- CreateIndex
CREATE INDEX "Message_status_idx" ON "Message"("status");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorExpertise" ADD CONSTRAINT "MentorExpertise_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorRecommendation" ADD CONSTRAINT "MentorRecommendation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorRecommendation" ADD CONSTRAINT "MentorRecommendation_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorRecommendation" ADD CONSTRAINT "MentorRecommendation_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "CareerAssessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
