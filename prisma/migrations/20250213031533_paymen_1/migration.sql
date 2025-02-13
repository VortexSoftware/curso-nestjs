/*
  Warnings:

  - A unique constraint covering the columns `[purchaseId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payment_purchaseId_key" ON "Payment"("purchaseId");
