/*
  Warnings:

  - Added the required column `requirements` to the `vacancys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vacancys" ADD COLUMN     "requirements" TEXT NOT NULL;
