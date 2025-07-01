/*
  Warnings:

  - The `lastSeen` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `joinDate` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL,
DROP COLUMN "lastSeen",
ADD COLUMN     "lastSeen" TIMESTAMP(3),
DROP COLUMN "joinDate",
ADD COLUMN     "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
