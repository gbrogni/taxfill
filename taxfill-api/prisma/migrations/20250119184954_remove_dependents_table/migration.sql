/*
  Warnings:

  - You are about to drop the `Dependent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsedDependent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Dependent" DROP CONSTRAINT "Dependent_userId_fkey";

-- DropForeignKey
ALTER TABLE "UsedDependent" DROP CONSTRAINT "UsedDependent_declarationId_fkey";

-- DropForeignKey
ALTER TABLE "UsedDependent" DROP CONSTRAINT "UsedDependent_dependentId_fkey";

-- DropTable
DROP TABLE "Dependent";

-- DropTable
DROP TABLE "UsedDependent";
