-- Migration: Add transactions table for Mercado Pago reconciliation
-- Date: 2026-01-24

-- Create transaction status enum
DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM (
        'APPROVED',
        'PENDING',
        'REJECTED',
        'CANCELLED',
        'REFUNDED',
        'IN_PROCESS',
        'IN_MEDIATION'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Mercado Pago IDs
    mp_payment_id VARCHAR(50) NOT NULL UNIQUE,
    mp_preference_id VARCHAR(100),

    -- User
    user_id UUID REFERENCES "User"(id) ON DELETE SET NULL,
    telegram_id VARCHAR(50),
    payer_email VARCHAR(255),

    -- Payment details
    package_id VARCHAR(50) NOT NULL,
    amount REAL NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    status transaction_status NOT NULL,
    status_detail VARCHAR(100),

    -- Payment method
    payment_method_id VARCHAR(50),
    payment_type_id VARCHAR(50),
    installments INTEGER DEFAULT 1,

    -- Anti-fraud
    device_id VARCHAR(100),
    ip_address VARCHAR(45),

    -- Raw MP data
    raw_data JSONB,

    -- Timestamps
    mp_date_created TIMESTAMP,
    mp_date_approved TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for reconciliation queries
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_telegram_id ON transactions(telegram_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payer_email ON transactions(payer_email);

COMMENT ON TABLE transactions IS 'Payment transactions for Mercado Pago reconciliation';
