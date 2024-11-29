/*
  Warnings:

  - You are about to drop the `black-list-tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `provisional-passwords` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "black-list-tokens" DROP CONSTRAINT "black-list-tokens_revoked_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "provisional-passwords" DROP CONSTRAINT "provisional-passwords_user_id_fkey";

-- DropTable
DROP TABLE "black-list-tokens";

-- DropTable
DROP TABLE "provisional-passwords";

-- CreateTable
CREATE TABLE "provisional_passwords" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provisional_password" TEXT,
    "active" BOOLEAN DEFAULT false,
    "expires_in" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provisional_passwords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "black_list_tokens" (
    "id" SERIAL NOT NULL,
    "token" VARCHAR NOT NULL,
    "revoked_by_user_id" INTEGER NOT NULL,
    "args" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "black_list_tokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "provisional_passwords" ADD CONSTRAINT "provisional_passwords_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "black_list_tokens" ADD CONSTRAINT "black_list_tokens_revoked_by_user_id_fkey" FOREIGN KEY ("revoked_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
