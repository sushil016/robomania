/*
  Warnings:

  - You are about to drop the column `userId` on the `Team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userEmail` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_userId_fkey";

-- DropIndex
DROP INDEX "Team_userId_key";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team_userEmail_key" ON "Team"("userEmail");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
