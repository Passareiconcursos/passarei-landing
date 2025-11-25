#!/bin/bash

# Remover comandos COPY e dados stdin
sed '/^COPY public\./,/^\\\.$/d' backup_supabase_final.sql > backup_inserts.sql

# Adicionar os INSERTs manualmente
cat >> backup_inserts.sql << 'INSERTS'

-- Inserir dados
INSERT INTO public."Admin" (id, email, password, name, role, "isActive", "createdAt", "updatedAt") VALUES
('cmichek920000t8ud4fqd6gc0', 'admin@passarei.com', '$2b$10$eHGV2xqU//cDVDl6G0X4X.NYYnHUGUNz0JsZ80rog2oqsvlMyNUE6', 'Admin Teste', 'SUPER_ADMIN', true, '2025-11-24 01:41:59.175', '2025-11-24 15:54:44.216');

INSERT INTO public."AdminSession" (id, "adminId", token, "expiresAt", "createdAt") VALUES
('cmida67390001v2p61ceefwwv', 'cmichek920000t8ud4fqd6gc0', '03a1320e1123b2c48fbab7904172a95f3f3848ba50aefc40182b7a0d010a3b0a', '2025-12-01 15:07:17.732', '2025-11-24 15:07:17.733'),
('cmidan1kx00024nv6q1cdaqzv', 'cmichek920000t8ud4fqd6gc0', '5ddef9ee3191c083baa675f0c1abdaf46ff568d304e3d2d4ffd017e80bffeee1', '2025-12-01 15:20:23.745', '2025-11-24 15:20:23.746'),
('cmidbv7gw00064nv6gerjzbt9', 'cmichek920000t8ud4fqd6gc0', '38a6cca0ad521b15b490ba34167f927120ce62acaaf514678ec08400e72c37fb', '2025-12-01 15:54:44.239', '2025-11-24 15:54:44.241');

INSERT INTO public."AuditLog" (id, "adminId", action, details, "createdAt") VALUES
('cmida673n0003v2p6pi93d1jd', 'cmichek920000t8ud4fqd6gc0', 'LOGIN admin cmichek920000t8ud4fqd6gc0', null, '2025-11-24 15:07:17.748'),
('cmidan1la00044nv62c7b2mef', 'cmichek920000t8ud4fqd6gc0', 'LOGIN admin cmichek920000t8ud4fqd6gc0', null, '2025-11-24 15:20:23.758'),
('cmidbv7h400084nv6v4rerkpr', 'cmichek920000t8ud4fqd6gc0', 'LOGIN admin cmichek920000t8ud4fqd6gc0', null, '2025-11-24 15:54:44.249');

INSERT INTO public."Cargo" (id, name, "displayName", description, organization, state, level, "editalUrl", "totalVagas", salario, "isActive", "createdAt", "updatedAt") VALUES
('cmichej6u0008rpiykxycg8k7', 'PM-SP-SOLDADO', 'PM-SP - Soldado', NULL, 'PM', 'SP', 'MEDIO', NULL, NULL, 3192.00, true, '2025-11-24 01:41:57.798', '2025-11-24 01:41:57.798'),
('cmichej760009rpiyjsd4muhh', 'PRF-AGENTE', 'PRF - Agente', NULL, 'PRF', NULL, 'SUPERIOR', NULL, NULL, 9300.00, true, '2025-11-24 01:41:57.81', '2025-11-24 01:41:57.81');

INSERT INTO public."Lead" (id, name, email, phone, "examType", state, status, source, notes, "assignedToId", "utmSource", "utmMedium", "utmCampaign", "acceptedWhatsApp", "createdAt", "updatedAt") VALUES
('cmidan1g900004nv61uob4vee', 'Maria Santos', 'maria1763997623@teste.com', '11988888888', 'PRF', 'RJ', 'NOVO', 'landing_page', NULL, NULL, NULL, NULL, NULL, true, '2025-11-24 15:20:23.577', '2025-11-24 15:20:23.577');

INSERT INTO public."Plan" (id, name, "displayName", description, "priceMonthly", "priceYearly", "dailyContentLimit", "dailyCorrectionLimit", "dailyEssayLimit", features, "allowsAffiliate", "affiliateCommission", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES
('cmichej450000rpiywaqsyx29', 'FREE', 'Plano Gratuito', 'Experimente o Passarei gratuitamente', 0.00, 0.00, 2, 2, 0, '["Onboarding","2 matérias/dia"]', false, NULL, true, 1, '2025-11-24 01:41:57.701', '2025-11-24 01:41:57.701'),
('cmichej5g0001rpiyttqlcgte', 'CALOURO', 'Plano Calouro', 'Para quem está começando', 12.90, NULL, 10, 10, 1, '["10 matérias/dia","1 redação/dia"]', false, NULL, true, 2, '2025-11-24 01:41:57.748', '2025-11-24 01:41:57.748'),
('cmichej5m0002rpiy5x9wbicz', 'VETERANO', 'Plano Veterano', 'Para concurseiros dedicados', 9.90, 118.80, 30, 30, 3, '["30 matérias/dia","3 redações/dia","Afiliados 20%"]', true, 20.00, true, 3, '2025-11-24 01:41:57.755', '2025-11-24 01:41:57.755');

INSERT INTO public."Subject" (id, name, "displayName", description, category, "isActive", "sortOrder", "createdAt", "updatedAt") VALUES
('cmichej5t0003rpiy2giws0j9', 'PORTUGUES', 'Língua Portuguesa', NULL, 'LINGUAGENS', true, 0, '2025-11-24 01:41:57.761', '2025-11-24 01:41:57.761'),
('cmichej610004rpiyjq7iswhn', 'MATEMATICA', 'Matemática', NULL, 'MATEMATICA', true, 1, '2025-11-24 01:41:57.769', '2025-11-24 01:41:57.769'),
('cmichej6a0005rpiyxqjqmyzr', 'DIR_CONSTITUCIONAL', 'Direito Constitucional', NULL, 'DIREITO', true, 2, '2025-11-24 01:41:57.778', '2025-11-24 01:41:57.778'),
('cmichej6f0006rpiyqzrso6dc', 'DIR_ADMINISTRATIVO', 'Direito Administrativo', NULL, 'DIREITO', true, 3, '2025-11-24 01:41:57.784', '2025-11-24 01:41:57.784'),
('cmichej6m0007rpiyf4nkyj67', 'DIR_PENAL', 'Direito Penal', NULL, 'DIREITO', true, 4, '2025-11-24 01:41:57.79', '2025-11-24 01:41:57.79');

INSERTS

echo "✅ Arquivo convertido para INSERTs!"
