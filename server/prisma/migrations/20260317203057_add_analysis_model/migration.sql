-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "resumeText" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);
