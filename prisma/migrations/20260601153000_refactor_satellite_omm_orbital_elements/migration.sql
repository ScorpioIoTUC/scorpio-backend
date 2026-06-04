-- AlterTable
ALTER TABLE "Satellite" RENAME COLUMN "last_tle_update" TO "tle_updated_at";

-- AlterTable
ALTER TABLE "Satellite"
    ADD COLUMN "object_id" TEXT,
    ADD COLUMN "epoch" TIMESTAMP(3),
    ADD COLUMN "mean_motion" DOUBLE PRECISION,
    ADD COLUMN "eccentricity" DOUBLE PRECISION,
    ADD COLUMN "inclination" DOUBLE PRECISION,
    ADD COLUMN "ra_of_asc_node" DOUBLE PRECISION,
    ADD COLUMN "arg_of_pericenter" DOUBLE PRECISION,
    ADD COLUMN "mean_anomaly" DOUBLE PRECISION,
    ADD COLUMN "bstar" DOUBLE PRECISION,
    ADD COLUMN "mean_motion_dot" DOUBLE PRECISION,
    ADD COLUMN "mean_motion_ddot" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Satellite"
    ALTER COLUMN "tle1" DROP NOT NULL,
    ALTER COLUMN "tle2" DROP NOT NULL,
    ALTER COLUMN "tle_updated_at" DROP NOT NULL;
