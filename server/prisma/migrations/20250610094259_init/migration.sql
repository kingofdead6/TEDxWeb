-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "picture" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "checkins" INTEGER NOT NULL DEFAULT 0,
    "responsibles" TEXT[],
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "gallery" TEXT[],
    "watchTalks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendee" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT,
    "cityCountry" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "companyUniversity" TEXT NOT NULL,
    "eventChoice" TEXT NOT NULL,
    "eventOther" TEXT,
    "reasonToAttend" TEXT NOT NULL,
    "attendedBefore" TEXT NOT NULL,
    "previousEvents" TEXT,
    "howHeard" TEXT NOT NULL,
    "howHeardOther" TEXT,
    "dietaryRestrictions" TEXT,
    "interests" TEXT[],
    "interestsOther" TEXT,
    "receiveUpdates" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "attendeeId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "pfp" TEXT,
    "organizationName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "websiteLinks" TEXT NOT NULL,
    "cityCountry" TEXT NOT NULL,
    "orgType" TEXT NOT NULL,
    "otherOrgType" TEXT,
    "whyPartner" TEXT NOT NULL,
    "supportType" TEXT[],
    "otherSupportType" TEXT,
    "specificEvents" TEXT NOT NULL,
    "partnershipBenefits" TEXT NOT NULL,
    "companyProfile" TEXT,
    "additionalComments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Speaker" (
    "id" TEXT NOT NULL,
    "pfp" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "cityCountry" TEXT NOT NULL,
    "linkedin" TEXT,
    "talkTitle" TEXT NOT NULL,
    "talkSummary" TEXT NOT NULL,
    "talkImportance" TEXT NOT NULL,
    "priorTalk" TEXT NOT NULL,
    "priorTalkDetails" TEXT,
    "speakerQualities" TEXT NOT NULL,
    "pastSpeeches" TEXT,
    "additionalInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Speaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "age" TEXT NOT NULL,
    "cityCountry" TEXT NOT NULL,
    "linkedin" TEXT,
    "commitment" TEXT NOT NULL,
    "priorExperience" TEXT NOT NULL,
    "priorExperienceDetails" TEXT,
    "roles" TEXT[],
    "otherRole" TEXT,
    "whyVolunteer" TEXT NOT NULL,
    "whatAdd" TEXT NOT NULL,
    "additionalComments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Press" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "mediaOutlet" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "otherPosition" TEXT,
    "cityCountry" TEXT NOT NULL,
    "socialLinks" TEXT,
    "coveragePlan" TEXT NOT NULL,
    "otherCoverage" TEXT,
    "pastCoverage" TEXT NOT NULL,
    "pastCoverageLinks" TEXT,
    "interest" TEXT NOT NULL,
    "specialRequirements" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Press_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Performer" (
    "id" TEXT NOT NULL,
    "pfp" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "team" TEXT,
    "cityCountry" TEXT NOT NULL,
    "socialLinks" TEXT,
    "performanceType" TEXT NOT NULL,
    "performanceTitle" TEXT,
    "description" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "specialEquipment" TEXT,
    "sampleLink" TEXT NOT NULL,
    "additionalComments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Performer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "organization" TEXT,
    "reason" TEXT NOT NULL,
    "otherReason" TEXT,
    "message" TEXT NOT NULL,
    "preferredContact" TEXT NOT NULL,
    "hearAboutUs" TEXT NOT NULL,
    "otherHearAboutUs" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventSpeakers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventSpeakers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EventPartners" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventPartners_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EventAttendees" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventAttendees_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_email_key" ON "Attendee"("email");

-- CreateIndex
CREATE INDEX "_EventSpeakers_B_index" ON "_EventSpeakers"("B");

-- CreateIndex
CREATE INDEX "_EventPartners_B_index" ON "_EventPartners"("B");

-- CreateIndex
CREATE INDEX "_EventAttendees_B_index" ON "_EventAttendees"("B");

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "Attendee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventSpeakers" ADD CONSTRAINT "_EventSpeakers_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventSpeakers" ADD CONSTRAINT "_EventSpeakers_B_fkey" FOREIGN KEY ("B") REFERENCES "Speaker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventPartners" ADD CONSTRAINT "_EventPartners_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventPartners" ADD CONSTRAINT "_EventPartners_B_fkey" FOREIGN KEY ("B") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventAttendees" ADD CONSTRAINT "_EventAttendees_A_fkey" FOREIGN KEY ("A") REFERENCES "Attendee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventAttendees" ADD CONSTRAINT "_EventAttendees_B_fkey" FOREIGN KEY ("B") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
