/*
  Warnings:

  - You are about to drop the `Vacancy` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `username` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'COMPANY';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;

-- DropTable
DROP TABLE "Vacancy";

-- CreateTable
CREATE TABLE "vacancys" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "salary" INTEGER,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vacancys_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vacancys" ADD CONSTRAINT "vacancys_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
