-- AlterTable
ALTER TABLE "Attendee" ALTER COLUMN "reasonToAttend" DROP NOT NULL,
ALTER COLUMN "attendedBefore" DROP NOT NULL,
ALTER COLUMN "howHeard" DROP NOT NULL;
