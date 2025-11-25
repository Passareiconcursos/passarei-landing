--
-- PostgreSQL database dump
--


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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it



--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AdminRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AdminRole" AS ENUM (
    'ADMIN',
    'SUPER_ADMIN',
    'VIEWER'
);



--
-- Name: AttemptType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AttemptType" AS ENUM (
    'QUIZ_FIXACAO',
    'QUESTAO_PRATICA',
    'SIMULADO',
    'REVISAO'
);



--
-- Name: CargoLevel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CargoLevel" AS ENUM (
    'FUNDAMENTAL',
    'MEDIO',
    'SUPERIOR'
);



--
-- Name: Difficulty; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Difficulty" AS ENUM (
    'FACIL',
    'MEDIO',
    'DIFICIL',
    'MUITO_DIFICIL'
);



--
-- Name: EssayStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EssayStatus" AS ENUM (
    'SUBMITTED',
    'CORRECTED',
    'PENDING'
);



--
-- Name: FeedbackType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."FeedbackType" AS ENUM (
    'CONTEUDO_QUALIDADE',
    'QUESTAO_QUALIDADE',
    'EXPLICACAO_CLARA',
    'DIFICULDADE_ADEQUADA',
    'EXPERIENCIA_GERAL',
    'BUG_REPORT',
    'SUGESTAO'
);



--
-- Name: LeadStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LeadStatus" AS ENUM (
    'NOVO',
    'CONTATADO',
    'QUALIFICADO',
    'CONVERTIDO',
    'PERDIDO'
);



--
-- Name: MessageType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MessageType" AS ENUM (
    'USER_MESSAGE',
    'BOT_RESPONSE',
    'SYSTEM',
    'CONTENT_DELIVERY',
    'QUESTION_DELIVERY',
    'REVIEW_PROMPT',
    'MOTIVATION',
    'REMINDER'
);



--
-- Name: NotificationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationStatus" AS ENUM (
    'PENDENTE',
    'ENVIADA',
    'ENTREGUE',
    'LIDA',
    'FALHOU',
    'CANCELADA'
);



--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationType" AS ENUM (
    'CONTEUDO_DIARIO',
    'QUESTAO_PRATICA',
    'REVISAO_ESPACADA',
    'LEMBRETE_ESTUDO',
    'MOTIVACAO',
    'RELATORIO_SEMANAL',
    'RELATORIO_MENSAL',
    'EDITAL_ATUALIZADO'
);



--
-- Name: PeriodType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PeriodType" AS ENUM (
    'DIARIO',
    'SEMANAL',
    'MENSAL'
);



--
-- Name: ProgressStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ProgressStatus" AS ENUM (
    'NAO_INICIADO',
    'EM_PROGRESSO',
    'CONCLUIDO',
    'DOMINADO'
);



--
-- Name: QuestionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."QuestionType" AS ENUM (
    'MULTIPLA_ESCOLHA',
    'CERTO_ERRADO'
);



--
-- Name: ReviewStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReviewStatus" AS ENUM (
    'PENDENTE',
    'CONCLUIDA',
    'PULADA',
    'CANCELADA'
);



--
-- Name: StudyLevel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StudyLevel" AS ENUM (
    'INICIANTE',
    'INTERMEDIARIO',
    'AVANCADO'
);



--
-- Name: SubjectCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SubjectCategory" AS ENUM (
    'LINGUAGENS',
    'MATEMATICA',
    'CIENCIAS_HUMANAS',
    'CIENCIAS_NATUREZA',
    'DIREITO',
    'INFORMATICA',
    'CONHECIMENTOS_GERAIS',
    'ESPECIFICAS'
);



--
-- Name: SubscriptionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SubscriptionStatus" AS ENUM (
    'ACTIVE',
    'EXPIRED',
    'CANCELED',
    'SUSPENDED',
    'PENDING_PAYMENT'
);



--
-- Name: TransactionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransactionStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'REFUNDED',
    'CANCELED'
);



SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Admin" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    role public."AdminRole" DEFAULT 'ADMIN'::public."AdminRole" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: AdminSession; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AdminSession" (
    id text NOT NULL,
    "adminId" text NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "adminId" text NOT NULL,
    action text NOT NULL,
    details jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



--
-- Name: Cargo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Cargo" (
    id text NOT NULL,
    name text NOT NULL,
    "displayName" text NOT NULL,
    description text,
    organization text NOT NULL,
    state text,
    level public."CargoLevel" NOT NULL,
    "editalUrl" text,
    "totalVagas" integer,
    salario numeric(10,2),
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: CargoSubject; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CargoSubject" (
    id text NOT NULL,
    "cargoId" text NOT NULL,
    "subjectId" text NOT NULL,
    weight numeric(5,2),
    "numberOfQuestions" integer
);



--
-- Name: Content; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Content" (
    id text NOT NULL,
    "subjectId" text NOT NULL,
    "topicId" text,
    title text NOT NULL,
    "textContent" text NOT NULL,
    difficulty public."Difficulty" NOT NULL,
    "wordCount" integer NOT NULL,
    "estimatedReadTime" integer NOT NULL,
    "audioUrl" text,
    "audioDuration" integer,
    "isActive" boolean DEFAULT true NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: Essay; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Essay" (
    id text NOT NULL,
    "userId" text NOT NULL,
    theme text NOT NULL,
    prompt text NOT NULL,
    text text NOT NULL,
    "wordCount" integer NOT NULL,
    "correctedAt" timestamp(3) without time zone,
    score1 integer,
    score2 integer,
    score3 integer,
    score4 integer,
    score5 integer,
    "totalScore" integer,
    feedback text,
    status public."EssayStatus" DEFAULT 'SUBMITTED'::public."EssayStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: Interaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Interaction" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "messageType" public."MessageType" NOT NULL,
    content text NOT NULL,
    intent text,
    confidence double precision,
    "contextData" jsonb,
    "responseTime" integer,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



--
-- Name: Lead; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Lead" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    "examType" text NOT NULL,
    state character varying(2) NOT NULL,
    status public."LeadStatus" DEFAULT 'NOVO'::public."LeadStatus" NOT NULL,
    source text DEFAULT 'landing_page'::text,
    notes text,
    "assignedToId" text,
    "utmSource" text,
    "utmMedium" text,
    "utmCampaign" text,
    "acceptedWhatsApp" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type public."NotificationType" NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    "scheduledFor" timestamp(3) without time zone NOT NULL,
    "sentAt" timestamp(3) without time zone,
    status public."NotificationStatus" DEFAULT 'PENDENTE'::public."NotificationStatus" NOT NULL,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: PerformanceStats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PerformanceStats" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "periodType" public."PeriodType" NOT NULL,
    "periodStart" timestamp(3) without time zone NOT NULL,
    "periodEnd" timestamp(3) without time zone NOT NULL,
    "daysActive" integer DEFAULT 0 NOT NULL,
    "contentsStudied" integer DEFAULT 0 NOT NULL,
    "questionsAnswered" integer DEFAULT 0 NOT NULL,
    "questionsCorrect" integer DEFAULT 0 NOT NULL,
    "accuracyRate" double precision DEFAULT 0 NOT NULL,
    "totalStudyTime" integer DEFAULT 0 NOT NULL,
    "currentStreak" integer DEFAULT 0 NOT NULL,
    "maxStreak" integer DEFAULT 0 NOT NULL,
    "subjectStats" jsonb,
    improvement double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: Plan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Plan" (
    id text NOT NULL,
    name text NOT NULL,
    "displayName" text NOT NULL,
    description text NOT NULL,
    "priceMonthly" numeric(10,2) NOT NULL,
    "priceYearly" numeric(10,2),
    "dailyContentLimit" integer NOT NULL,
    "dailyCorrectionLimit" integer NOT NULL,
    "dailyEssayLimit" integer NOT NULL,
    features jsonb NOT NULL,
    "allowsAffiliate" boolean DEFAULT false NOT NULL,
    "affiliateCommission" numeric(5,2),
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: Question; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Question" (
    id text NOT NULL,
    "subjectId" text NOT NULL,
    "topicId" text,
    statement text NOT NULL,
    "questionType" public."QuestionType" NOT NULL,
    alternatives jsonb,
    "correctAnswer" text NOT NULL,
    explanation text NOT NULL,
    "wrongExplanations" jsonb,
    difficulty public."Difficulty" NOT NULL,
    "examBoard" text,
    "examYear" integer,
    "examName" text,
    tags jsonb,
    "isActive" boolean DEFAULT true NOT NULL,
    "timesUsed" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: QuestionAttempt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QuestionAttempt" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "questionId" text NOT NULL,
    "userAnswer" text NOT NULL,
    "isCorrect" boolean NOT NULL,
    "timeSpent" integer,
    "attemptType" public."AttemptType" NOT NULL,
    "reviewAttempt" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



--
-- Name: SpacedReview; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SpacedReview" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "contentId" text,
    "questionId" text,
    "topicId" text,
    "scheduledFor" timestamp(3) without time zone NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "reviewNumber" integer DEFAULT 1 NOT NULL,
    "interval" integer DEFAULT 1 NOT NULL,
    "easinessFactor" double precision DEFAULT 2.5 NOT NULL,
    quality integer,
    "wasSuccessful" boolean,
    status public."ReviewStatus" DEFAULT 'PENDENTE'::public."ReviewStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: StudyPlan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StudyPlan" (
    id text NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    description text,
    "basedOnEdital" boolean DEFAULT false NOT NULL,
    "editalUrl" text,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "isCompleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: StudyPlanItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StudyPlanItem" (
    id text NOT NULL,
    "studyPlanId" text NOT NULL,
    "subjectId" text NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    weight numeric(5,2),
    "numberOfQuestions" integer,
    "targetProgress" integer DEFAULT 100 NOT NULL,
    "currentProgress" integer DEFAULT 0 NOT NULL,
    "isCompleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: StudySession; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StudySession" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "startTime" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endTime" timestamp(3) without time zone,
    duration integer,
    "contentsViewed" integer DEFAULT 0 NOT NULL,
    "questionsAnswered" integer DEFAULT 0 NOT NULL,
    "questionsCorrect" integer DEFAULT 0 NOT NULL,
    "deviceInfo" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: Subject; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subject" (
    id text NOT NULL,
    name text NOT NULL,
    "displayName" text NOT NULL,
    description text,
    category public."SubjectCategory" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: Subscription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Subscription" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "planId" text NOT NULL,
    status public."SubscriptionStatus" DEFAULT 'ACTIVE'::public."SubscriptionStatus" NOT NULL,
    "startDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endDate" timestamp(3) without time zone,
    "paymentMethod" text,
    "paymentId" text,
    "autoRenew" boolean DEFAULT true NOT NULL,
    "renewalDate" timestamp(3) without time zone,
    "canceledAt" timestamp(3) without time zone,
    "cancelReason" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: SystemConfig; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SystemConfig" (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    description text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: Topic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Topic" (
    id text NOT NULL,
    "subjectId" text NOT NULL,
    name text NOT NULL,
    description text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transaction" (
    id text NOT NULL,
    "subscriptionId" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'BRL'::text NOT NULL,
    "gatewayId" text,
    "gatewayName" text NOT NULL,
    status public."TransactionStatus" DEFAULT 'PENDING'::public."TransactionStatus" NOT NULL,
    "paidAt" timestamp(3) without time zone,
    "affiliateId" text,
    "commissionAmount" numeric(10,2),
    "commissionPaid" boolean DEFAULT false NOT NULL,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    phone text NOT NULL,
    name text,
    email text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isBanned" boolean DEFAULT false NOT NULL,
    "banReason" text,
    "isAffiliate" boolean DEFAULT false NOT NULL,
    "affiliateCode" text,
    "referredBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: UserFeedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserFeedback" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type public."FeedbackType" NOT NULL,
    rating integer,
    comment text,
    "relatedContentId" text,
    "relatedQuestionId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



--
-- Name: UserProfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserProfile" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "cargoId" text,
    state text,
    "examDate" timestamp(3) without time zone,
    "editalUrl" text,
    "editalAnalyzed" boolean DEFAULT false NOT NULL,
    "availableTimeDaily" integer NOT NULL,
    "studyLevel" public."StudyLevel" NOT NULL,
    "preferredSchedules" jsonb NOT NULL,
    "strongSubjects" jsonb,
    "weakSubjects" jsonb,
    "allowNotifications" boolean DEFAULT true NOT NULL,
    "allowMotivation" boolean DEFAULT true NOT NULL,
    "allowAudios" boolean DEFAULT false NOT NULL,
    timezone text DEFAULT 'America/Sao_Paulo'::text NOT NULL,
    "planJson" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Name: UserProgress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserProgress" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "contentId" text NOT NULL,
    status public."ProgressStatus" NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "lastViewedAt" timestamp(3) without time zone,
    "quizAttempts" integer DEFAULT 0 NOT NULL,
    "quizCorrect" integer DEFAULT 0 NOT NULL,
    "needsReview" boolean DEFAULT false NOT NULL,
    "nextReviewAt" timestamp(3) without time zone,
    "reviewInterval" integer,
    "easinessFactor" double precision DEFAULT 2.5 NOT NULL,
    "hasDoubt" boolean DEFAULT false NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);



--
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: AdminSession; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Cargo; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: CargoSubject; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Content; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Essay; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Interaction; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Lead; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: PerformanceStats; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Plan; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Question; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: QuestionAttempt; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: SpacedReview; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: StudyPlan; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: StudyPlanItem; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: StudySession; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Subject; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Subscription; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: SystemConfig; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Topic; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: UserFeedback; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: UserProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: UserProgress; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: AdminSession AdminSession_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AdminSession"
    ADD CONSTRAINT "AdminSession_pkey" PRIMARY KEY (id);


--
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: CargoSubject CargoSubject_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CargoSubject"
    ADD CONSTRAINT "CargoSubject_pkey" PRIMARY KEY (id);


--
-- Name: Cargo Cargo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cargo"
    ADD CONSTRAINT "Cargo_pkey" PRIMARY KEY (id);


--
-- Name: Content Content_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Content"
    ADD CONSTRAINT "Content_pkey" PRIMARY KEY (id);


--
-- Name: Essay Essay_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Essay"
    ADD CONSTRAINT "Essay_pkey" PRIMARY KEY (id);


--
-- Name: Interaction Interaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Interaction"
    ADD CONSTRAINT "Interaction_pkey" PRIMARY KEY (id);


--
-- Name: Lead Lead_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lead"
    ADD CONSTRAINT "Lead_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: PerformanceStats PerformanceStats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PerformanceStats"
    ADD CONSTRAINT "PerformanceStats_pkey" PRIMARY KEY (id);


--
-- Name: Plan Plan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Plan"
    ADD CONSTRAINT "Plan_pkey" PRIMARY KEY (id);


--
-- Name: QuestionAttempt QuestionAttempt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuestionAttempt"
    ADD CONSTRAINT "QuestionAttempt_pkey" PRIMARY KEY (id);


--
-- Name: Question Question_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_pkey" PRIMARY KEY (id);


--
-- Name: SpacedReview SpacedReview_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpacedReview"
    ADD CONSTRAINT "SpacedReview_pkey" PRIMARY KEY (id);


--
-- Name: StudyPlanItem StudyPlanItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudyPlanItem"
    ADD CONSTRAINT "StudyPlanItem_pkey" PRIMARY KEY (id);


--
-- Name: StudyPlan StudyPlan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudyPlan"
    ADD CONSTRAINT "StudyPlan_pkey" PRIMARY KEY (id);


--
-- Name: StudySession StudySession_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudySession"
    ADD CONSTRAINT "StudySession_pkey" PRIMARY KEY (id);


--
-- Name: Subject Subject_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT "Subject_pkey" PRIMARY KEY (id);


--
-- Name: Subscription Subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY (id);


--
-- Name: SystemConfig SystemConfig_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY (id);


--
-- Name: Topic Topic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: UserFeedback UserFeedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserFeedback"
    ADD CONSTRAINT "UserFeedback_pkey" PRIMARY KEY (id);


--
-- Name: UserProfile UserProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserProfile"
    ADD CONSTRAINT "UserProfile_pkey" PRIMARY KEY (id);


--
-- Name: UserProgress UserProgress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserProgress"
    ADD CONSTRAINT "UserProgress_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: AdminSession_adminId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AdminSession_adminId_idx" ON public."AdminSession" USING btree ("adminId");


--
-- Name: AdminSession_expiresAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AdminSession_expiresAt_idx" ON public."AdminSession" USING btree ("expiresAt");


--
-- Name: AdminSession_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AdminSession_token_idx" ON public."AdminSession" USING btree (token);


--
-- Name: AdminSession_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AdminSession_token_key" ON public."AdminSession" USING btree (token);


--
-- Name: Admin_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Admin_email_idx" ON public."Admin" USING btree (email);


--
-- Name: Admin_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Admin_email_key" ON public."Admin" USING btree (email);


--
-- Name: AuditLog_adminId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_adminId_idx" ON public."AuditLog" USING btree ("adminId");


--
-- Name: AuditLog_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_createdAt_idx" ON public."AuditLog" USING btree ("createdAt");


--
-- Name: CargoSubject_cargoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CargoSubject_cargoId_idx" ON public."CargoSubject" USING btree ("cargoId");


--
-- Name: CargoSubject_cargoId_subjectId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CargoSubject_cargoId_subjectId_key" ON public."CargoSubject" USING btree ("cargoId", "subjectId");


--
-- Name: CargoSubject_subjectId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CargoSubject_subjectId_idx" ON public."CargoSubject" USING btree ("subjectId");


--
-- Name: Cargo_level_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Cargo_level_idx" ON public."Cargo" USING btree (level);


--
-- Name: Cargo_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Cargo_name_idx" ON public."Cargo" USING btree (name);


--
-- Name: Cargo_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Cargo_name_key" ON public."Cargo" USING btree (name);


--
-- Name: Cargo_organization_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Cargo_organization_idx" ON public."Cargo" USING btree (organization);


--
-- Name: Cargo_state_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Cargo_state_idx" ON public."Cargo" USING btree (state);


--
-- Name: Content_difficulty_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Content_difficulty_idx" ON public."Content" USING btree (difficulty);


--
-- Name: Content_subjectId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Content_subjectId_idx" ON public."Content" USING btree ("subjectId");


--
-- Name: Content_topicId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Content_topicId_idx" ON public."Content" USING btree ("topicId");


--
-- Name: Essay_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Essay_status_idx" ON public."Essay" USING btree (status);


--
-- Name: Essay_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Essay_userId_idx" ON public."Essay" USING btree ("userId");


--
-- Name: Interaction_messageType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Interaction_messageType_idx" ON public."Interaction" USING btree ("messageType");


--
-- Name: Interaction_timestamp_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Interaction_timestamp_idx" ON public."Interaction" USING btree ("timestamp");


--
-- Name: Interaction_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Interaction_userId_idx" ON public."Interaction" USING btree ("userId");


--
-- Name: Lead_assignedToId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Lead_assignedToId_idx" ON public."Lead" USING btree ("assignedToId");


--
-- Name: Lead_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Lead_createdAt_idx" ON public."Lead" USING btree ("createdAt");


--
-- Name: Lead_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Lead_email_idx" ON public."Lead" USING btree (email);


--
-- Name: Lead_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Lead_email_key" ON public."Lead" USING btree (email);


--
-- Name: Lead_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Lead_status_idx" ON public."Lead" USING btree (status);


--
-- Name: Notification_scheduledFor_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_scheduledFor_idx" ON public."Notification" USING btree ("scheduledFor");


--
-- Name: Notification_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_status_idx" ON public."Notification" USING btree (status);


--
-- Name: Notification_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_type_idx" ON public."Notification" USING btree (type);


--
-- Name: Notification_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_userId_idx" ON public."Notification" USING btree ("userId");


--
-- Name: PerformanceStats_periodType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PerformanceStats_periodType_idx" ON public."PerformanceStats" USING btree ("periodType");


--
-- Name: PerformanceStats_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PerformanceStats_userId_idx" ON public."PerformanceStats" USING btree ("userId");


--
-- Name: PerformanceStats_userId_periodType_periodStart_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PerformanceStats_userId_periodType_periodStart_key" ON public."PerformanceStats" USING btree ("userId", "periodType", "periodStart");


--
-- Name: Plan_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Plan_isActive_idx" ON public."Plan" USING btree ("isActive");


--
-- Name: Plan_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Plan_name_idx" ON public."Plan" USING btree (name);


--
-- Name: Plan_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Plan_name_key" ON public."Plan" USING btree (name);


--
-- Name: QuestionAttempt_attemptType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "QuestionAttempt_attemptType_idx" ON public."QuestionAttempt" USING btree ("attemptType");


--
-- Name: QuestionAttempt_isCorrect_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "QuestionAttempt_isCorrect_idx" ON public."QuestionAttempt" USING btree ("isCorrect");


--
-- Name: QuestionAttempt_questionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "QuestionAttempt_questionId_idx" ON public."QuestionAttempt" USING btree ("questionId");


--
-- Name: QuestionAttempt_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "QuestionAttempt_userId_idx" ON public."QuestionAttempt" USING btree ("userId");


--
-- Name: Question_difficulty_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Question_difficulty_idx" ON public."Question" USING btree (difficulty);


--
-- Name: Question_examBoard_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Question_examBoard_idx" ON public."Question" USING btree ("examBoard");


--
-- Name: Question_subjectId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Question_subjectId_idx" ON public."Question" USING btree ("subjectId");


--
-- Name: Question_topicId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Question_topicId_idx" ON public."Question" USING btree ("topicId");


--
-- Name: SpacedReview_contentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SpacedReview_contentId_idx" ON public."SpacedReview" USING btree ("contentId");


--
-- Name: SpacedReview_questionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SpacedReview_questionId_idx" ON public."SpacedReview" USING btree ("questionId");


--
-- Name: SpacedReview_scheduledFor_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SpacedReview_scheduledFor_idx" ON public."SpacedReview" USING btree ("scheduledFor");


--
-- Name: SpacedReview_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SpacedReview_status_idx" ON public."SpacedReview" USING btree (status);


--
-- Name: SpacedReview_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SpacedReview_userId_idx" ON public."SpacedReview" USING btree ("userId");


--
-- Name: StudyPlanItem_studyPlanId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StudyPlanItem_studyPlanId_idx" ON public."StudyPlanItem" USING btree ("studyPlanId");


--
-- Name: StudyPlanItem_subjectId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StudyPlanItem_subjectId_idx" ON public."StudyPlanItem" USING btree ("subjectId");


--
-- Name: StudyPlan_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StudyPlan_isActive_idx" ON public."StudyPlan" USING btree ("isActive");


--
-- Name: StudyPlan_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StudyPlan_userId_idx" ON public."StudyPlan" USING btree ("userId");


--
-- Name: StudySession_startTime_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StudySession_startTime_idx" ON public."StudySession" USING btree ("startTime");


--
-- Name: StudySession_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StudySession_userId_idx" ON public."StudySession" USING btree ("userId");


--
-- Name: Subject_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Subject_category_idx" ON public."Subject" USING btree (category);


--
-- Name: Subject_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Subject_name_idx" ON public."Subject" USING btree (name);


--
-- Name: Subject_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Subject_name_key" ON public."Subject" USING btree (name);


--
-- Name: Subscription_endDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Subscription_endDate_idx" ON public."Subscription" USING btree ("endDate");


--
-- Name: Subscription_planId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Subscription_planId_idx" ON public."Subscription" USING btree ("planId");


--
-- Name: Subscription_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Subscription_status_idx" ON public."Subscription" USING btree (status);


--
-- Name: Subscription_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Subscription_userId_idx" ON public."Subscription" USING btree ("userId");


--
-- Name: Subscription_userId_planId_startDate_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Subscription_userId_planId_startDate_key" ON public."Subscription" USING btree ("userId", "planId", "startDate");


--
-- Name: SystemConfig_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SystemConfig_key_idx" ON public."SystemConfig" USING btree (key);


--
-- Name: SystemConfig_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SystemConfig_key_key" ON public."SystemConfig" USING btree (key);


--
-- Name: Topic_subjectId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Topic_subjectId_idx" ON public."Topic" USING btree ("subjectId");


--
-- Name: Transaction_affiliateId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Transaction_affiliateId_idx" ON public."Transaction" USING btree ("affiliateId");


--
-- Name: Transaction_gatewayId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Transaction_gatewayId_idx" ON public."Transaction" USING btree ("gatewayId");


--
-- Name: Transaction_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Transaction_status_idx" ON public."Transaction" USING btree (status);


--
-- Name: Transaction_subscriptionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Transaction_subscriptionId_idx" ON public."Transaction" USING btree ("subscriptionId");


--
-- Name: UserFeedback_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserFeedback_type_idx" ON public."UserFeedback" USING btree (type);


--
-- Name: UserFeedback_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserFeedback_userId_idx" ON public."UserFeedback" USING btree ("userId");


--
-- Name: UserProfile_cargoId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserProfile_cargoId_idx" ON public."UserProfile" USING btree ("cargoId");


--
-- Name: UserProfile_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserProfile_userId_idx" ON public."UserProfile" USING btree ("userId");


--
-- Name: UserProfile_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserProfile_userId_key" ON public."UserProfile" USING btree ("userId");


--
-- Name: UserProgress_contentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserProgress_contentId_idx" ON public."UserProgress" USING btree ("contentId");


--
-- Name: UserProgress_needsReview_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserProgress_needsReview_idx" ON public."UserProgress" USING btree ("needsReview");


--
-- Name: UserProgress_nextReviewAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserProgress_nextReviewAt_idx" ON public."UserProgress" USING btree ("nextReviewAt");


--
-- Name: UserProgress_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserProgress_status_idx" ON public."UserProgress" USING btree (status);


--
-- Name: UserProgress_userId_contentId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserProgress_userId_contentId_key" ON public."UserProgress" USING btree ("userId", "contentId");


--
-- Name: UserProgress_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserProgress_userId_idx" ON public."UserProgress" USING btree ("userId");


--
-- Name: User_affiliateCode_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_affiliateCode_idx" ON public."User" USING btree ("affiliateCode");


--
-- Name: User_affiliateCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_affiliateCode_key" ON public."User" USING btree ("affiliateCode");


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_isAffiliate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_isAffiliate_idx" ON public."User" USING btree ("isAffiliate");


--
-- Name: User_phone_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_phone_idx" ON public."User" USING btree (phone);


--
-- Name: User_phone_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_phone_key" ON public."User" USING btree (phone);


--
-- Name: User_referredBy_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_referredBy_idx" ON public."User" USING btree ("referredBy");


--
-- Name: AdminSession AdminSession_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AdminSession"
    ADD CONSTRAINT "AdminSession_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AuditLog AuditLog_adminId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CargoSubject CargoSubject_cargoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CargoSubject"
    ADD CONSTRAINT "CargoSubject_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES public."Cargo"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CargoSubject CargoSubject_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CargoSubject"
    ADD CONSTRAINT "CargoSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Content Content_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Content"
    ADD CONSTRAINT "Content_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Content Content_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Content"
    ADD CONSTRAINT "Content_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Essay Essay_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Essay"
    ADD CONSTRAINT "Essay_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Interaction Interaction_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Interaction"
    ADD CONSTRAINT "Interaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Lead Lead_assignedToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lead"
    ADD CONSTRAINT "Lead_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES public."Admin"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PerformanceStats PerformanceStats_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PerformanceStats"
    ADD CONSTRAINT "PerformanceStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuestionAttempt QuestionAttempt_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuestionAttempt"
    ADD CONSTRAINT "QuestionAttempt_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."Question"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuestionAttempt QuestionAttempt_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuestionAttempt"
    ADD CONSTRAINT "QuestionAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Question Question_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Question Question_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SpacedReview SpacedReview_contentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpacedReview"
    ADD CONSTRAINT "SpacedReview_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES public."Content"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SpacedReview SpacedReview_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpacedReview"
    ADD CONSTRAINT "SpacedReview_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."Question"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SpacedReview SpacedReview_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpacedReview"
    ADD CONSTRAINT "SpacedReview_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SpacedReview SpacedReview_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SpacedReview"
    ADD CONSTRAINT "SpacedReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudyPlanItem StudyPlanItem_studyPlanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudyPlanItem"
    ADD CONSTRAINT "StudyPlanItem_studyPlanId_fkey" FOREIGN KEY ("studyPlanId") REFERENCES public."StudyPlan"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudyPlanItem StudyPlanItem_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudyPlanItem"
    ADD CONSTRAINT "StudyPlanItem_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudyPlan StudyPlan_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudyPlan"
    ADD CONSTRAINT "StudyPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudySession StudySession_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudySession"
    ADD CONSTRAINT "StudySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Subscription Subscription_planId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES public."Plan"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Subscription Subscription_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Topic Topic_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Transaction Transaction_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Transaction Transaction_subscriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES public."Subscription"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserProfile UserProfile_cargoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserProfile"
    ADD CONSTRAINT "UserProfile_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES public."Cargo"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: UserProfile UserProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserProfile"
    ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserProgress UserProgress_contentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserProgress"
    ADD CONSTRAINT "UserProgress_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES public."Content"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserProgress UserProgress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserProgress"
    ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_referredBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_referredBy_fkey" FOREIGN KEY ("referredBy") REFERENCES public."User"("affiliateCode") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--



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

