-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" VARCHAR DEFAULT 'ENABLE';

-- CreateTable
CREATE TABLE "BlackListTokens" (
    "user_id" INTEGER NOT NULL,
    "token" VARCHAR NOT NULL,

    CONSTRAINT "BlackListTokens_pkey" PRIMARY KEY ("user_id","token")
);

-- AddForeignKey
ALTER TABLE "BlackListTokens" ADD CONSTRAINT "BlackListTokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
