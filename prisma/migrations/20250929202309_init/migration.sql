-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
