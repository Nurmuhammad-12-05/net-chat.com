/*
  Warnings:

  - The `requirements` column on the `vacancys` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "vacancys" DROP COLUMN "requirements",
ADD COLUMN     "requirements" TEXT[];
