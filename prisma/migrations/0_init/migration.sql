-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'CALOURO', 'VETERANO');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELED', 'SUSPENDED', 'PENDING_PAYMENT');

-- Baseline: Tabelas existentes já estão no banco
-- Esta migration marca o estado inicial
