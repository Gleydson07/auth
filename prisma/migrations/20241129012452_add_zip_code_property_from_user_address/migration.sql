/*
  Warnings:

  - Added the required column `zipCode` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "DocTypeEnum" ADD VALUE 'CNH';

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "zipCode" VARCHAR NOT NULL;
