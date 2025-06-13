-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "isRegistrationOpen" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "seats" INTEGER;
