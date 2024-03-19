/*
  Warnings:

  - The primary key for the `BlackListTokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `BlackListTokens` table. All the data in the column will be lost.
  - Added the required column `revoked_by_user_id` to the `BlackListTokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BlackListTokens" DROP CONSTRAINT "BlackListTokens_user_id_fkey";

-- AlterTable
ALTER TABLE "BlackListTokens" DROP CONSTRAINT "BlackListTokens_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "revoked_by_user_id" INTEGER NOT NULL,
ADD CONSTRAINT "BlackListTokens_pkey" PRIMARY KEY ("token");
