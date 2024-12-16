/*
  Warnings:

  - You are about to drop the column `notificationId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `securityId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Security` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_securityId_fkey";

-- DropIndex
DROP INDEX "User_notificationId_key";

-- DropIndex
DROP INDEX "User_securityId_key";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Security" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "notificationId",
DROP COLUMN "securityId";

-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_key" ON "Notification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Security_userId_key" ON "Security"("userId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Security" ADD CONSTRAINT "Security_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
