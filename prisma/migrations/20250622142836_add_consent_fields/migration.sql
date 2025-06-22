-- AlterTable
ALTER TABLE "User" ADD COLUMN     "consentDate" TIMESTAMP(3),
ADD COLUMN     "consentMarketing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "consentNewsletter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastActivity" TIMESTAMP(3);
