-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'INSTITUTION_REPRESENTATIVE', 'STUDENT');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'CLOSED', 'BANNED');

-- CreateEnum
CREATE TYPE "CredentialStatus" AS ENUM ('NEW', 'UPLOADING_TO_BLOCKCHAIN', 'FAILED_UPLOADING_TO_BLOCKCHAIN', 'UPLOADED_TO_BLOCKCHAIN', 'ACTIVATED', 'WITHDRAWN', 'EXPIRED', 'DELETED');

-- CreateEnum
CREATE TYPE "InsitutionStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CredentialChangeRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "UserActionType" AS ENUM ('REVIEW_UPLOAD', 'REVIEW_WITHDRAWAL', 'REVIEW_CHANGE_REQUEST');

-- CreateEnum
CREATE TYPE "UserActionStatus" AS ENUM ('ACTIVE', 'DECISION_MADE');

-- CreateEnum
CREATE TYPE "CredentialsWithdrawalRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SmartContractStatus" AS ENUM ('ACTIVE', 'STORAGE_EXCEEDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT E'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "fullName" TEXT,
    "currency" TEXT NOT NULL DEFAULT E'GBP',
    "stripeCustomerId" TEXT,
    "signatureUrl" TEXT,
    "title" TEXT,
    "institutionUuid" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "credentials" (
    "uuid" TEXT NOT NULL,
    "status" "CredentialStatus" NOT NULL DEFAULT E'NEW',
    "studentUuid" TEXT NOT NULL,
    "institutionUuid" TEXT NOT NULL,
    "uploadUuid" TEXT NOT NULL,
    "did" TEXT,
    "certificateId" TEXT,
    "graduatedName" TEXT,
    "qualificationName" TEXT,
    "majors" TEXT,
    "minors" TEXT,
    "awardingInstitution" TEXT,
    "qualificationLevel" TEXT,
    "awardLevel" TEXT,
    "studyLanguage" TEXT,
    "info" TEXT,
    "gpaFinalGrade" TEXT,
    "studyStartedAt" TIMESTAMP(3),
    "studyEndedAt" TIMESTAMP(3),
    "graduatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "authenticatedAt" TIMESTAMP(3),
    "authenticatedBy" TEXT,
    "authenticatedTitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "institutions" (
    "uuid" TEXT NOT NULL,
    "status" "InsitutionStatus" NOT NULL DEFAULT E'ACTIVE',
    "emailDomain" TEXT NOT NULL,
    "logoUrl" TEXT,
    "stampUrl" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "uploads" (
    "uuid" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "mapping" TEXT NOT NULL,
    "status" "UploadStatus" NOT NULL DEFAULT E'PENDING',
    "uploadedBy" TEXT NOT NULL,
    "confirmationsRequestedFrom" TEXT[],
    "confirmedBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uploads_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "credentialShares" (
    "uuid" TEXT NOT NULL,
    "sharedBy" TEXT NOT NULL,
    "recipientEmails" TEXT[],
    "credentialUuids" TEXT[],
    "credentialQualificationNames" TEXT[],
    "sharedFields" TEXT[],
    "temporaryPassword" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credentialShares_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "credentialChanges" (
    "id" SERIAL NOT NULL,
    "credentialUuid" TEXT NOT NULL,
    "credentialDid" TEXT NOT NULL,
    "changedByUuid" TEXT,
    "changedFrom" TEXT[],
    "changedTo" TEXT[],
    "fieldName" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hash" TEXT NOT NULL,
    "smartContractId" TEXT,

    CONSTRAINT "credentialChanges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credentialChangeRequests" (
    "uuid" TEXT NOT NULL,
    "credentialUuid" TEXT NOT NULL,
    "status" "CredentialChangeRequestStatus" NOT NULL DEFAULT E'PENDING',
    "requestedBy" TEXT NOT NULL,
    "confirmationRequestedFrom" TEXT[],
    "confirmedBy" TEXT,
    "changeFrom" TEXT[],
    "changeTo" TEXT[],
    "fieldName" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credentialChangeRequests_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "credentialUuid" TEXT,
    "fee" TEXT,
    "transactionId" TEXT,
    "type" TEXT,
    "smartContractId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userActions" (
    "id" SERIAL NOT NULL,
    "status" "UserActionStatus" NOT NULL DEFAULT E'ACTIVE',
    "userUuid" TEXT NOT NULL,
    "initiatorName" TEXT NOT NULL,
    "type" "UserActionType" NOT NULL,
    "subjectUuid" TEXT NOT NULL,
    "credentialsUuid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userActions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credentialsWithdrawalRequests" (
    "uuid" TEXT NOT NULL,
    "credentialsUuid" TEXT NOT NULL,
    "status" "CredentialsWithdrawalRequestStatus" NOT NULL DEFAULT E'PENDING',
    "initiatedBy" TEXT NOT NULL,
    "confirmationsRequestedFrom" TEXT[],
    "confirmedBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credentialsWithdrawalRequests_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "oneTimePasswords" (
    "uuid" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "canBeResentAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oneTimePasswords_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "smartContracts" (
    "id" TEXT NOT NULL,
    "status" "SmartContractStatus" NOT NULL DEFAULT E'ACTIVE',
    "deployedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "systemSettings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "systemSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "uuid" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "studentUuid" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT E'PENDING',
    "amount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "currency" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "credentialUuids" TEXT[],

    CONSTRAINT "payments_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "users"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_did_key" ON "credentials"("did");

-- CreateIndex
CREATE UNIQUE INDEX "institutions_emailDomain_key" ON "institutions"("emailDomain");

-- CreateIndex
CREATE UNIQUE INDEX "credentialChanges_hash_key" ON "credentialChanges"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "credentialChangeRequests_credentialUuid_key" ON "credentialChangeRequests"("credentialUuid");

-- CreateIndex
CREATE UNIQUE INDEX "credentialsWithdrawalRequests_credentialsUuid_key" ON "credentialsWithdrawalRequests"("credentialsUuid");

-- CreateIndex
CREATE UNIQUE INDEX "smartContracts_id_key" ON "smartContracts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "systemSettings_name_key" ON "systemSettings"("name");

-- CreateIndex
CREATE UNIQUE INDEX "payments_externalId_key" ON "payments"("externalId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_institutionUuid_fkey" FOREIGN KEY ("institutionUuid") REFERENCES "institutions"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_studentUuid_fkey" FOREIGN KEY ("studentUuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_institutionUuid_fkey" FOREIGN KEY ("institutionUuid") REFERENCES "institutions"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_uploadUuid_fkey" FOREIGN KEY ("uploadUuid") REFERENCES "uploads"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentialChanges" ADD CONSTRAINT "credentialChanges_credentialUuid_fkey" FOREIGN KEY ("credentialUuid") REFERENCES "credentials"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_smartContractId_fkey" FOREIGN KEY ("smartContractId") REFERENCES "smartContracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_studentUuid_fkey" FOREIGN KEY ("studentUuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
