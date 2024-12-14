/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `loginAlert` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Security` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OwnerType" AS ENUM ('ORGANIZATION', 'USER');

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "createdAt",
DROP COLUMN "loginAlert",
ADD COLUMN     "loginEmailAlert" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Security" DROP COLUMN "createdAt";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "keys" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repository" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "ownerUrl" TEXT NOT NULL,
    "ownerType" "OwnerType" NOT NULL,
    "githubUrl" TEXT NOT NULL,
    "description" TEXT,
    "addedAt" TIMESTAMPTZ NOT NULL,
    "httpsCloneUrl" TEXT NOT NULL,
    "sshCloneUrl" TEXT NOT NULL,
    "homepage" TEXT,
    "branch" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepositoryUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RepositoryUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReleaseInfo" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "date" TIMESTAMPTZ NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ReleaseInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_endpoint_key" ON "Subscription"("endpoint");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_name_owner_key" ON "Repository"("name", "owner");

-- CreateIndex
CREATE UNIQUE INDEX "RepositoryUser_userId_repositoryId_key" ON "RepositoryUser"("userId", "repositoryId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepositoryUser" ADD CONSTRAINT "RepositoryUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepositoryUser" ADD CONSTRAINT "RepositoryUser_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseInfo" ADD CONSTRAINT "ReleaseInfo_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
