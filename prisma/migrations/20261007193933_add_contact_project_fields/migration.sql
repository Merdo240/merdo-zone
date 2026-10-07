/*
  Warnings:

  - Added the required column `service` to the `ContactMessage` table without a default value. This is not possible if the table is not empty.
  - Made the column `subject` on table `ContactMessage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ContactMessage` ADD COLUMN `budget` VARCHAR(50) NULL,
    ADD COLUMN `phone` VARCHAR(30) NULL,
    ADD COLUMN `service` VARCHAR(50) NOT NULL,
    MODIFY `subject` VARCHAR(200) NOT NULL;
