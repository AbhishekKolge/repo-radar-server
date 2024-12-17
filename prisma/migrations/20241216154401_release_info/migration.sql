/*
  Warnings:

  - Made the column `userId` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Security` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ReleaseInfo" ALTER COLUMN "notes" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Security" ALTER COLUMN "userId" SET NOT NULL;
