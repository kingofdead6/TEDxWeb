-- AlterTable
ALTER TABLE "Partner" ADD COLUMN     "isVisibleOnMainPage" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Speaker" ADD COLUMN     "isVisibleOnMainPage" BOOLEAN NOT NULL DEFAULT false;
