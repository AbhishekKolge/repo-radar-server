/*
  Warnings:

  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `loginMethod` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordCodeExpiration` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationCodeExpiration` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isVerified",
DROP COLUMN "loginMethod",
DROP COLUMN "password",
DROP COLUMN "resetPasswordCode",
DROP COLUMN "resetPasswordCodeExpiration",
DROP COLUMN "verificationCode",
DROP COLUMN "verificationCodeExpiration",
ADD COLUMN     "emailVerificationCode" TEXT,
ADD COLUMN     "emailVerificationCodeExpiration" TIMESTAMPTZ,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- DropEnum
DROP TYPE "LoginMethod";
