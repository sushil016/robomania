-- CreateEnum
CREATE TYPE "RegistrationStatus" IF NOT EXISTS AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'WAITLISTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" IF NOT EXISTS AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ContactStatus" IF NOT EXISTS AS ENUM ('PENDING', 'RESPONDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AdminRole" IF NOT EXISTS AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MODERATOR');

-- CreateTable
CREATE TABLE IF NOT EXISTS "users" (
  -- ... (rest of your schema)
);

-- ... (rest of your tables) 