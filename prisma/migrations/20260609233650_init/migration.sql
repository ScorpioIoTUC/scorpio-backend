-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('normal', 'admin');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pwd_encrypted" TEXT NOT NULL,
    "type" "UserType" NOT NULL DEFAULT 'normal',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Satellite" (
    "id" SERIAL NOT NULL,
    "norad_id" INTEGER NOT NULL,
    "display_name" TEXT NOT NULL,
    "object_id" TEXT,
    "epoch" TIMESTAMP(3),
    "mean_motion" DOUBLE PRECISION,
    "eccentricity" DOUBLE PRECISION,
    "inclination" DOUBLE PRECISION,
    "ra_of_asc_node" DOUBLE PRECISION,
    "arg_of_pericenter" DOUBLE PRECISION,
    "mean_anomaly" DOUBLE PRECISION,
    "bstar" DOUBLE PRECISION,
    "mean_motion_dot" DOUBLE PRECISION,
    "mean_motion_ddot" DOUBLE PRECISION,
    "tle1" TEXT,
    "tle2" TEXT,
    "tle_updated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Satellite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Station" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "altitude" DOUBLE PRECISION NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decoder_config" BYTEA,
    "owner_id" INTEGER NOT NULL,
    "owner_key_hash" TEXT NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Packet" (
    "id" SERIAL NOT NULL,
    "station_id" INTEGER NOT NULL,
    "satellite_id" INTEGER NOT NULL,
    "satellite_latitude" DOUBLE PRECISION NOT NULL,
    "satellite_longitude" DOUBLE PRECISION NOT NULL,
    "satellite_altitude" DOUBLE PRECISION NOT NULL,
    "slant_distance" DOUBLE PRECISION NOT NULL,
    "angle_elevation" DOUBLE PRECISION NOT NULL,
    "rssi" DOUBLE PRECISION NOT NULL,
    "snr" DOUBLE PRECISION NOT NULL,
    "frec_error" DOUBLE PRECISION NOT NULL,
    "crc" BOOLEAN NOT NULL,
    "raw_payload" BYTEA NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Packet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Satellite_norad_id_key" ON "Satellite"("norad_id");

-- CreateIndex
CREATE UNIQUE INDEX "Station_uuid_key" ON "Station"("uuid");

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Packet" ADD CONSTRAINT "Packet_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Packet" ADD CONSTRAINT "Packet_satellite_id_fkey" FOREIGN KEY ("satellite_id") REFERENCES "Satellite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
