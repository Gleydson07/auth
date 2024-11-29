/*
  Warnings:

  - The primary key for the `black_list_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `black_list_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "black_list_tokens" DROP CONSTRAINT "black_list_tokens_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "black_list_tokens_pkey" PRIMARY KEY ("token");
