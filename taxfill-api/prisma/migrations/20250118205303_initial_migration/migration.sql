-- CreateEnum
CREATE TYPE "DeclarationStatus" AS ENUM ('DRAFT', 'SUBMITTED');

-- CreateEnum
CREATE TYPE "IncomeType" AS ENUM ('SALARY', 'RENT', 'INVESTMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "DeductionType" AS ENUM ('HEALTH', 'EDUCATION', 'DEPENDENTS', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Declaration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "originalDeclarationId" TEXT,
    "year" INTEGER NOT NULL,
    "status" "DeclarationStatus" NOT NULL DEFAULT 'DRAFT',
    "totalIncome" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDeductions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxDue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxRefund" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Declaration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Income" (
    "id" TEXT NOT NULL,
    "declarationId" TEXT NOT NULL,
    "type" "IncomeType" NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deduction" (
    "id" TEXT NOT NULL,
    "declarationId" TEXT NOT NULL,
    "type" "DeductionType" NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Deduction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dependent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsedDependent" (
    "id" TEXT NOT NULL,
    "declarationId" TEXT NOT NULL,
    "dependentId" TEXT NOT NULL,

    CONSTRAINT "UsedDependent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UsedDependent_declarationId_dependentId_key" ON "UsedDependent"("declarationId", "dependentId");

-- AddForeignKey
ALTER TABLE "Declaration" ADD CONSTRAINT "Declaration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Declaration" ADD CONSTRAINT "Declaration_originalDeclarationId_fkey" FOREIGN KEY ("originalDeclarationId") REFERENCES "Declaration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_declarationId_fkey" FOREIGN KEY ("declarationId") REFERENCES "Declaration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deduction" ADD CONSTRAINT "Deduction_declarationId_fkey" FOREIGN KEY ("declarationId") REFERENCES "Declaration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependent" ADD CONSTRAINT "Dependent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedDependent" ADD CONSTRAINT "UsedDependent_declarationId_fkey" FOREIGN KEY ("declarationId") REFERENCES "Declaration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedDependent" ADD CONSTRAINT "UsedDependent_dependentId_fkey" FOREIGN KEY ("dependentId") REFERENCES "Dependent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
