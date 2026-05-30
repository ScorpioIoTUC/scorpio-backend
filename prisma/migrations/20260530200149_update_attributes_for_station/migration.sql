/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Station` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `Station` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Station" ADD COLUMN     "uuid" TEXT NOT NULL,
ALTER COLUMN "decoder_config" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Station_uuid_key" ON "Station"("uuid");
