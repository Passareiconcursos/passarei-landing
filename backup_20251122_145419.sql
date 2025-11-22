--
-- PostgreSQL database dump
--

\restrict YmoaklmQNT7jpwBWqLghhRQQzhYI81GsdZpbbbPdXZ5AP6QkvXhaTooZvroKcsn

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: PlanType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PlanType" AS ENUM (
    'FREE',
    'CALOURO',
    'VETERANO'
);


ALTER TYPE public."PlanType" OWNER TO postgres;

--
-- Name: SubscriptionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SubscriptionStatus" AS ENUM (
    'ACTIVE',
    'CANCELED',
    'EXPIRED',
    'TRIAL'
);


ALTER TYPE public."SubscriptionStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AIGeneratedContent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AIGeneratedContent" (
    id text NOT NULL,
    exam_type text NOT NULL,
    title text NOT NULL,
    definition text NOT NULL,
    key_points text NOT NULL,
    example text NOT NULL,
    tip text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AIGeneratedContent" OWNER TO postgres;

--
-- Name: AffiliateCommission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AffiliateCommission" (
    id text NOT NULL,
    affiliate_id text NOT NULL,
    referral_id text NOT NULL,
    reference_month text NOT NULL,
    commission_amount numeric(10,2) NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    paid_at timestamp(3) without time zone,
    pix_key text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AffiliateCommission" OWNER TO postgres;

--
-- Name: EssayCorrection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EssayCorrection" (
    id text NOT NULL,
    user_id text NOT NULL,
    is_free boolean DEFAULT false NOT NULL,
    price_paid numeric(10,2),
    original_text text NOT NULL,
    image_url text,
    score integer,
    detailed_feedback text,
    strengths text[],
    improvements text[],
    ai_cost numeric(10,4) NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at timestamp(3) without time zone
);


ALTER TABLE public."EssayCorrection" OWNER TO postgres;

--
-- Name: ExamSubject; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExamSubject" (
    id text NOT NULL,
    exam_type text NOT NULL,
    state text DEFAULT 'ALL_STATES'::text NOT NULL,
    cargo text NOT NULL,
    subject_name text NOT NULL,
    weight integer DEFAULT 3 NOT NULL,
    is_reference boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ExamSubject" OWNER TO postgres;

--
-- Name: Plan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Plan" (
    id text NOT NULL,
    type public."PlanType" NOT NULL,
    name text NOT NULL,
    price_monthly numeric(10,2) NOT NULL,
    price_annual numeric(10,2),
    daily_materials_limit integer NOT NULL,
    daily_corrections_limit integer NOT NULL,
    daily_essay_corrections integer NOT NULL,
    extra_essay_price numeric(10,2),
    has_study_plan boolean DEFAULT false NOT NULL,
    has_monthly_simulados boolean DEFAULT false NOT NULL,
    has_unlimited_simulados boolean DEFAULT false NOT NULL,
    support_sla_hours integer NOT NULL,
    affiliate_commission_rate numeric(5,2),
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Plan" OWNER TO postgres;

--
-- Name: Referral; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Referral" (
    id text NOT NULL,
    referrer_id text NOT NULL,
    referred_id text NOT NULL,
    program_type text NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    qualified_at timestamp(3) without time zone,
    rewarded_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Referral" OWNER TO postgres;

--
-- Name: Subscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subscription" (
    id text NOT NULL,
    user_id text NOT NULL,
    plan_id text NOT NULL,
    status public."SubscriptionStatus" DEFAULT 'ACTIVE'::public."SubscriptionStatus" NOT NULL,
    started_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    current_period_start timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    current_period_end timestamp(3) without time zone NOT NULL,
    canceled_at timestamp(3) without time zone,
    guarantee_expires_at timestamp(3) without time zone NOT NULL,
    mercado_pago_subscription_id text,
    mercado_pago_payment_id text,
    payment_method text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Subscription" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    telegram_id text,
    whatsapp_number text,
    name text,
    email text,
    exam_type text,
    state text,
    cargo text,
    nivel text,
    facilidades text[],
    dificuldades text[],
    tempo_disponivel text,
    horario_estudo text,
    plan_type public."PlanType" DEFAULT 'FREE'::public."PlanType" NOT NULL,
    subscription_id text,
    daily_content_count integer DEFAULT 0 NOT NULL,
    daily_corrections_count integer DEFAULT 0 NOT NULL,
    daily_essays_count integer DEFAULT 0 NOT NULL,
    last_content_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    total_questions_answered integer DEFAULT 0 NOT NULL,
    correct_answers integer DEFAULT 0 NOT NULL,
    wrong_answers integer DEFAULT 0 NOT NULL,
    total_study_time integer DEFAULT 0 NOT NULL,
    is_premium boolean DEFAULT false NOT NULL,
    premium_until timestamp(3) without time zone,
    referral_code text,
    referred_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    onboarding_completed_at timestamp(3) without time zone
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Data for Name: AIGeneratedContent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AIGeneratedContent" (id, exam_type, title, definition, key_points, example, tip, created_at) FROM stdin;
\.


--
-- Data for Name: AffiliateCommission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AffiliateCommission" (id, affiliate_id, referral_id, reference_month, commission_amount, status, paid_at, pix_key, created_at) FROM stdin;
\.


--
-- Data for Name: EssayCorrection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EssayCorrection" (id, user_id, is_free, price_paid, original_text, image_url, score, detailed_feedback, strengths, improvements, ai_cost, status, created_at, completed_at) FROM stdin;
\.


--
-- Data for Name: ExamSubject; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExamSubject" (id, exam_type, state, cargo, subject_name, weight, is_reference, created_at) FROM stdin;
\.


--
-- Data for Name: Plan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Plan" (id, type, name, price_monthly, price_annual, daily_materials_limit, daily_corrections_limit, daily_essay_corrections, extra_essay_price, has_study_plan, has_monthly_simulados, has_unlimited_simulados, support_sla_hours, affiliate_commission_rate, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: Referral; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Referral" (id, referrer_id, referred_id, program_type, status, qualified_at, rewarded_at, created_at) FROM stdin;
\.


--
-- Data for Name: Subscription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Subscription" (id, user_id, plan_id, status, started_at, current_period_start, current_period_end, canceled_at, guarantee_expires_at, mercado_pago_subscription_id, mercado_pago_payment_id, payment_method, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, telegram_id, whatsapp_number, name, email, exam_type, state, cargo, nivel, facilidades, dificuldades, tempo_disponivel, horario_estudo, plan_type, subscription_id, daily_content_count, daily_corrections_count, daily_essays_count, last_content_date, total_questions_answered, correct_answers, wrong_answers, total_study_time, is_premium, premium_until, referral_code, referred_by, created_at, updated_at, onboarding_completed_at) FROM stdin;
\.


--
-- Name: AIGeneratedContent AIGeneratedContent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AIGeneratedContent"
    ADD CONSTRAINT "AIGeneratedContent_pkey" PRIMARY KEY (id);


--
-- Name: AffiliateCommission AffiliateCommission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AffiliateCommission"
    ADD CONSTRAINT "AffiliateCommission_pkey" PRIMARY KEY (id);


--
-- Name: EssayCorrection EssayCorrection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EssayCorrection"
    ADD CONSTRAINT "EssayCorrection_pkey" PRIMARY KEY (id);


--
-- Name: ExamSubject ExamSubject_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExamSubject"
    ADD CONSTRAINT "ExamSubject_pkey" PRIMARY KEY (id);


--
-- Name: Plan Plan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Plan"
    ADD CONSTRAINT "Plan_pkey" PRIMARY KEY (id);


--
-- Name: Referral Referral_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Referral"
    ADD CONSTRAINT "Referral_pkey" PRIMARY KEY (id);


--
-- Name: Subscription Subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: AIGeneratedContent_exam_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AIGeneratedContent_exam_type_idx" ON public."AIGeneratedContent" USING btree (exam_type);


--
-- Name: AffiliateCommission_affiliate_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AffiliateCommission_affiliate_id_idx" ON public."AffiliateCommission" USING btree (affiliate_id);


--
-- Name: AffiliateCommission_reference_month_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AffiliateCommission_reference_month_idx" ON public."AffiliateCommission" USING btree (reference_month);


--
-- Name: AffiliateCommission_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AffiliateCommission_status_idx" ON public."AffiliateCommission" USING btree (status);


--
-- Name: EssayCorrection_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EssayCorrection_created_at_idx" ON public."EssayCorrection" USING btree (created_at);


--
-- Name: EssayCorrection_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EssayCorrection_user_id_idx" ON public."EssayCorrection" USING btree (user_id);


--
-- Name: ExamSubject_exam_type_cargo_state_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ExamSubject_exam_type_cargo_state_idx" ON public."ExamSubject" USING btree (exam_type, cargo, state);


--
-- Name: Plan_type_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Plan_type_key" ON public."Plan" USING btree (type);


--
-- Name: Referral_referred_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Referral_referred_id_idx" ON public."Referral" USING btree (referred_id);


--
-- Name: Referral_referrer_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Referral_referrer_id_idx" ON public."Referral" USING btree (referrer_id);


--
-- Name: Referral_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Referral_status_idx" ON public."Referral" USING btree (status);


--
-- Name: Subscription_mercado_pago_subscription_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Subscription_mercado_pago_subscription_id_key" ON public."Subscription" USING btree (mercado_pago_subscription_id);


--
-- Name: Subscription_plan_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Subscription_plan_id_idx" ON public."Subscription" USING btree (plan_id);


--
-- Name: Subscription_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Subscription_user_id_idx" ON public."Subscription" USING btree (user_id);


--
-- Name: Subscription_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Subscription_user_id_key" ON public."Subscription" USING btree (user_id);


--
-- Name: User_referral_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_referral_code_key" ON public."User" USING btree (referral_code);


--
-- Name: User_subscription_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_subscription_id_key" ON public."User" USING btree (subscription_id);


--
-- Name: User_telegram_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_telegram_id_key" ON public."User" USING btree (telegram_id);


--
-- Name: User_whatsapp_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_whatsapp_number_key" ON public."User" USING btree (whatsapp_number);


--
-- Name: AffiliateCommission AffiliateCommission_affiliate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AffiliateCommission"
    ADD CONSTRAINT "AffiliateCommission_affiliate_id_fkey" FOREIGN KEY (affiliate_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EssayCorrection EssayCorrection_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EssayCorrection"
    ADD CONSTRAINT "EssayCorrection_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Referral Referral_referred_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Referral"
    ADD CONSTRAINT "Referral_referred_id_fkey" FOREIGN KEY (referred_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Referral Referral_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Referral"
    ADD CONSTRAINT "Referral_referrer_id_fkey" FOREIGN KEY (referrer_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Subscription Subscription_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES public."Plan"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Subscription Subscription_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict YmoaklmQNT7jpwBWqLghhRQQzhYI81GsdZpbbbPdXZ5AP6QkvXhaTooZvroKcsn

