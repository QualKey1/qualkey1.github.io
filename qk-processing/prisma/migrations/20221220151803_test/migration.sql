/*
  Warnings:

  - A unique constraint covering the columns `[transactionHash]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `certificateId` on table `credentials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `graduatedName` on table `credentials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `qualificationName` on table `credentials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `majors` on table `credentials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `minors` on table `credentials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `awardingInstitution` on table `credentials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `qualificationLevel` on table `credentials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `awardLevel` on table `credentials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `studyLanguage` on table `credentials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `info` on table `credentials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gpaFinalGrade` on table `credentials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authenticatedBy` on table `credentials` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authenticatedTitle` on table `credentials` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "UserStatus" ADD VALUE 'DELETED';

-- AlterTable
ALTER TABLE "credentialChanges" ADD COLUMN     "transactionHash" TEXT,
ADD COLUMN     "transactionId" TEXT;

-- AlterTable
ALTER TABLE "credentials" ALTER COLUMN "certificateId" SET NOT NULL,
ALTER COLUMN "certificateId" SET DEFAULT E'',
ALTER COLUMN "graduatedName" SET NOT NULL,
ALTER COLUMN "graduatedName" SET DEFAULT E'',
ALTER COLUMN "qualificationName" SET NOT NULL,
ALTER COLUMN "qualificationName" SET DEFAULT E'',
ALTER COLUMN "majors" SET NOT NULL,
ALTER COLUMN "majors" SET DEFAULT E'',
ALTER COLUMN "minors" SET NOT NULL,
ALTER COLUMN "minors" SET DEFAULT E'',
ALTER COLUMN "awardingInstitution" SET NOT NULL,
ALTER COLUMN "awardingInstitution" SET DEFAULT E'',
ALTER COLUMN "qualificationLevel" SET NOT NULL,
ALTER COLUMN "qualificationLevel" SET DEFAULT E'',
ALTER COLUMN "awardLevel" SET NOT NULL,
ALTER COLUMN "awardLevel" SET DEFAULT E'',
ALTER COLUMN "studyLanguage" SET NOT NULL,
ALTER COLUMN "studyLanguage" SET DEFAULT E'',
ALTER COLUMN "info" SET NOT NULL,
ALTER COLUMN "info" SET DEFAULT E'',
ALTER COLUMN "gpaFinalGrade" SET NOT NULL,
ALTER COLUMN "gpaFinalGrade" SET DEFAULT E'',
ALTER COLUMN "authenticatedBy" SET NOT NULL,
ALTER COLUMN "authenticatedBy" SET DEFAULT E'',
ALTER COLUMN "authenticatedTitle" SET NOT NULL,
ALTER COLUMN "authenticatedTitle" SET DEFAULT E'';

-- AlterTable
ALTER TABLE "institutions" ADD COLUMN     "mapping" JSONB;

-- AlterTable
ALTER TABLE "smartContracts" ADD CONSTRAINT "smartContracts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "transactionHash" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "subscribedToEmails" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "institutionStats" (
    "id" SERIAL NOT NULL,
    "institutionUuid" TEXT NOT NULL,
    "totalQualifications" INTEGER NOT NULL DEFAULT 0,
    "withdrawnQualifications" INTEGER NOT NULL DEFAULT 0,
    "editedQualifications" INTEGER NOT NULL DEFAULT 0,
    "sharedQualifications" INTEGER NOT NULL DEFAULT 0,
    "deletedQualifications" INTEGER NOT NULL DEFAULT 0,
    "activatedQualifications" INTEGER NOT NULL DEFAULT 0,
    "qualificationNames" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institutionStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "institutionStats_institutionUuid_key" ON "institutionStats"("institutionUuid");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transactionHash_key" ON "transactions"("transactionHash");
