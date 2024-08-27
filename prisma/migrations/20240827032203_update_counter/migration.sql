-- CreateTable
CREATE TABLE "UpdateCounter" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "lastReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UpdateCounter_pkey" PRIMARY KEY ("id")
);
