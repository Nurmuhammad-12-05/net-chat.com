/*
  Warnings:

  - You are about to drop the `error_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "error_logs";

-- CreateTable
CREATE TABLE "error_loges" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "errorType" TEXT,
    "stack" TEXT,
    "module" TEXT,
    "controller" TEXT,
    "service" TEXT,
    "route" TEXT,
    "method" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_loges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_ai" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_ai_pkey" PRIMARY KEY ("id")
);
