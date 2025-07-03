/*
  Warnings:

  - You are about to drop the `UserBlock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserBlock" DROP CONSTRAINT "UserBlock_blockedById_fkey";

-- DropForeignKey
ALTER TABLE "UserBlock" DROP CONSTRAINT "UserBlock_userId_fkey";

-- DropTable
DROP TABLE "UserBlock";

-- CreateTable
CREATE TABLE "userBlock" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blockedById" TEXT NOT NULL,
    "reason" TEXT,
    "blockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unblockAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "userBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "userBlock_userId_idx" ON "userBlock"("userId");

-- CreateIndex
CREATE INDEX "userBlock_isActive_idx" ON "userBlock"("isActive");

-- AddForeignKey
ALTER TABLE "userBlock" ADD CONSTRAINT "userBlock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userBlock" ADD CONSTRAINT "userBlock_blockedById_fkey" FOREIGN KEY ("blockedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
