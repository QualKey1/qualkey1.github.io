toc.dat                                                                                             0000600 0004000 0002000 00000112060 14350374676 0014456 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP       6                    z            qualkey    13.9 (Debian 13.9-1.pgdg110+1)    13.9 (Debian 13.9-1.pgdg110+1) g    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         �           1262    16384    qualkey    DATABASE     [   CREATE DATABASE qualkey WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';
    DROP DATABASE qualkey;
                qualkey    false         �           1247    17468    CredentialChangeRequestStatus    TYPE     n   CREATE TYPE public."CredentialChangeRequestStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);
 2   DROP TYPE public."CredentialChangeRequestStatus";
       public          qualkey    false         �           1247    17436    CredentialStatus    TYPE     �   CREATE TYPE public."CredentialStatus" AS ENUM (
    'NEW',
    'UPLOADING_TO_BLOCKCHAIN',
    'FAILED_UPLOADING_TO_BLOCKCHAIN',
    'UPLOADED_TO_BLOCKCHAIN',
    'ACTIVATED',
    'WITHDRAWN',
    'EXPIRED',
    'DELETED'
);
 %   DROP TYPE public."CredentialStatus";
       public          qualkey    false         �           1247    17490 "   CredentialsWithdrawalRequestStatus    TYPE     s   CREATE TYPE public."CredentialsWithdrawalRequestStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);
 7   DROP TYPE public."CredentialsWithdrawalRequestStatus";
       public          qualkey    false         �           1247    17454    InsitutionStatus    TYPE     N   CREATE TYPE public."InsitutionStatus" AS ENUM (
    'ACTIVE',
    'CLOSED'
);
 %   DROP TYPE public."InsitutionStatus";
       public          qualkey    false         �           1247    17504    PaymentStatus    TYPE     ]   CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED'
);
 "   DROP TYPE public."PaymentStatus";
       public          qualkey    false         �           1247    17418    Role    TYPE     w   CREATE TYPE public."Role" AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'INSTITUTION_REPRESENTATIVE',
    'STUDENT'
);
    DROP TYPE public."Role";
       public          qualkey    false         �           1247    17498    SmartContractStatus    TYPE     [   CREATE TYPE public."SmartContractStatus" AS ENUM (
    'ACTIVE',
    'STORAGE_EXCEEDED'
);
 (   DROP TYPE public."SmartContractStatus";
       public          qualkey    false         �           1247    18312    TransactionStatus    TYPE     l   CREATE TYPE public."TransactionStatus" AS ENUM (
    'NEW',
    'PENDING',
    'CONFIRMED',
    'FAILED'
);
 &   DROP TYPE public."TransactionStatus";
       public          qualkey    false         �           1247    17460    UploadStatus    TYPE     ]   CREATE TYPE public."UploadStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);
 !   DROP TYPE public."UploadStatus";
       public          qualkey    false         �           1247    17484    UserActionStatus    TYPE     U   CREATE TYPE public."UserActionStatus" AS ENUM (
    'ACTIVE',
    'DECISION_MADE'
);
 %   DROP TYPE public."UserActionStatus";
       public          qualkey    false         �           1247    17476    UserActionType    TYPE     {   CREATE TYPE public."UserActionType" AS ENUM (
    'REVIEW_UPLOAD',
    'REVIEW_WITHDRAWAL',
    'REVIEW_CHANGE_REQUEST'
);
 #   DROP TYPE public."UserActionType";
       public          qualkey    false         �           1247    17428 
   UserStatus    TYPE     e   CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'CLOSED',
    'BANNED',
    'DELETED'
);
    DROP TYPE public."UserStatus";
       public          qualkey    false         �            1259    17407    _prisma_migrations    TABLE     �  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public._prisma_migrations;
       public         heap    qualkey    false         �            1259    17573    credentialChangeRequests    TABLE       CREATE TABLE public."credentialChangeRequests" (
    uuid text NOT NULL,
    "credentialUuid" text NOT NULL,
    status public."CredentialChangeRequestStatus" DEFAULT 'PENDING'::public."CredentialChangeRequestStatus" NOT NULL,
    "requestedBy" text NOT NULL,
    "confirmationRequestedFrom" text[],
    "confirmedBy" text,
    "changeFrom" text[],
    "changeTo" text[],
    "fieldName" text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
 .   DROP TABLE public."credentialChangeRequests";
       public         heap    qualkey    false    662    662         �            1259    17563    credentialChanges    TABLE     �  CREATE TABLE public."credentialChanges" (
    id integer NOT NULL,
    "credentialUuid" text NOT NULL,
    "credentialDid" text NOT NULL,
    "changedByUuid" text,
    "changedFrom" text[],
    "changedTo" text[],
    "fieldName" text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    hash text NOT NULL,
    "smartContractId" text,
    "transactionHash" text,
    "transactionId" text
);
 '   DROP TABLE public."credentialChanges";
       public         heap    qualkey    false         �            1259    17561    credentialChanges_id_seq    SEQUENCE     �   CREATE SEQUENCE public."credentialChanges_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public."credentialChanges_id_seq";
       public          qualkey    false    207         �           0    0    credentialChanges_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public."credentialChanges_id_seq" OWNED BY public."credentialChanges".id;
          public          qualkey    false    206         �            1259    17552    credentialShares    TABLE     �  CREATE TABLE public."credentialShares" (
    uuid text NOT NULL,
    "sharedBy" text NOT NULL,
    "recipientEmails" text[],
    "credentialUuids" text[],
    "credentialQualificationNames" text[],
    "sharedFields" text[],
    "temporaryPassword" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 &   DROP TABLE public."credentialShares";
       public         heap    qualkey    false         �            1259    17522    credentials    TABLE     .  CREATE TABLE public.credentials (
    uuid text NOT NULL,
    status public."CredentialStatus" DEFAULT 'NEW'::public."CredentialStatus" NOT NULL,
    "studentUuid" text NOT NULL,
    "institutionUuid" text NOT NULL,
    "uploadUuid" text NOT NULL,
    did text,
    "certificateId" text DEFAULT ''::text NOT NULL,
    "graduatedName" text DEFAULT ''::text NOT NULL,
    "qualificationName" text DEFAULT ''::text NOT NULL,
    majors text DEFAULT ''::text NOT NULL,
    minors text DEFAULT ''::text NOT NULL,
    "awardingInstitution" text DEFAULT ''::text NOT NULL,
    "qualificationLevel" text DEFAULT ''::text NOT NULL,
    "awardLevel" text DEFAULT ''::text NOT NULL,
    "studyLanguage" text DEFAULT ''::text NOT NULL,
    info text DEFAULT ''::text NOT NULL,
    "gpaFinalGrade" text DEFAULT ''::text NOT NULL,
    "studyStartedAt" timestamp(3) without time zone,
    "studyEndedAt" timestamp(3) without time zone,
    "graduatedAt" timestamp(3) without time zone,
    "expiresAt" timestamp(3) without time zone,
    "authenticatedAt" timestamp(3) without time zone,
    "authenticatedBy" text DEFAULT ''::text NOT NULL,
    "authenticatedTitle" text DEFAULT ''::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public.credentials;
       public         heap    qualkey    false    653    653         �            1259    17608    credentialsWithdrawalRequests    TABLE     �  CREATE TABLE public."credentialsWithdrawalRequests" (
    uuid text NOT NULL,
    "credentialsUuid" text NOT NULL,
    status public."CredentialsWithdrawalRequestStatus" DEFAULT 'PENDING'::public."CredentialsWithdrawalRequestStatus" NOT NULL,
    "initiatedBy" text NOT NULL,
    "confirmationsRequestedFrom" text[],
    "confirmedBy" text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
 3   DROP TABLE public."credentialsWithdrawalRequests";
       public         heap    qualkey    false    671    671         �            1259    18293    institutionStats    TABLE     f  CREATE TABLE public."institutionStats" (
    id integer NOT NULL,
    "institutionUuid" text NOT NULL,
    "totalQualifications" integer DEFAULT 0 NOT NULL,
    "withdrawnQualifications" integer DEFAULT 0 NOT NULL,
    "editedQualifications" integer DEFAULT 0 NOT NULL,
    "sharedQualifications" integer DEFAULT 0 NOT NULL,
    "deletedQualifications" integer DEFAULT 0 NOT NULL,
    "activatedQualifications" integer DEFAULT 0 NOT NULL,
    "qualificationNames" text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
 &   DROP TABLE public."institutionStats";
       public         heap    qualkey    false         �            1259    18291    institutionStats_id_seq    SEQUENCE     �   CREATE SEQUENCE public."institutionStats_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public."institutionStats_id_seq";
       public          qualkey    false    220         �           0    0    institutionStats_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public."institutionStats_id_seq" OWNED BY public."institutionStats".id;
          public          qualkey    false    219         �            1259    17532    institutions    TABLE     �  CREATE TABLE public.institutions (
    uuid text NOT NULL,
    status public."InsitutionStatus" DEFAULT 'ACTIVE'::public."InsitutionStatus" NOT NULL,
    "emailDomain" text NOT NULL,
    "logoUrl" text,
    "stampUrl" text,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    mapping jsonb
);
     DROP TABLE public.institutions;
       public         heap    qualkey    false    656    656         �            1259    17618    oneTimePasswords    TABLE     �   CREATE TABLE public."oneTimePasswords" (
    uuid text NOT NULL,
    code text NOT NULL,
    "validUntil" timestamp(3) without time zone NOT NULL,
    "canBeResentAt" timestamp(3) without time zone NOT NULL
);
 &   DROP TABLE public."oneTimePasswords";
       public         heap    qualkey    false         �            1259    17646    payments    TABLE     �  CREATE TABLE public.payments (
    uuid text NOT NULL,
    "externalId" text NOT NULL,
    "studentUuid" text NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    amount numeric(10,2) DEFAULT 0.00 NOT NULL,
    currency text NOT NULL,
    method text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "credentialUuids" text[]
);
    DROP TABLE public.payments;
       public         heap    qualkey    false    677    677         �            1259    17626    smartContracts    TABLE     �   CREATE TABLE public."smartContracts" (
    id text NOT NULL,
    status public."SmartContractStatus" DEFAULT 'ACTIVE'::public."SmartContractStatus" NOT NULL,
    "deployedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 $   DROP TABLE public."smartContracts";
       public         heap    qualkey    false    674    674         �            1259    17636    systemSettings    TABLE     �   CREATE TABLE public."systemSettings" (
    id integer NOT NULL,
    name text NOT NULL,
    value text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
 $   DROP TABLE public."systemSettings";
       public         heap    qualkey    false         �            1259    17634    systemSettings_id_seq    SEQUENCE     �   CREATE SEQUENCE public."systemSettings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public."systemSettings_id_seq";
       public          qualkey    false    217         �           0    0    systemSettings_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public."systemSettings_id_seq" OWNED BY public."systemSettings".id;
          public          qualkey    false    216         �            1259    17585    transactions    TABLE       CREATE TABLE public.transactions (
    id integer NOT NULL,
    "credentialUuid" text,
    fee text,
    "transactionId" text,
    type text,
    "smartContractId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "transactionHash" text
);
     DROP TABLE public.transactions;
       public         heap    qualkey    false         �            1259    17583    transactions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.transactions_id_seq;
       public          qualkey    false    210         �           0    0    transactions_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;
          public          qualkey    false    209         �            1259    17542    uploads    TABLE     �  CREATE TABLE public.uploads (
    uuid text NOT NULL,
    filename text NOT NULL,
    "originalFilename" text NOT NULL,
    mapping text NOT NULL,
    status public."UploadStatus" DEFAULT 'PENDING'::public."UploadStatus" NOT NULL,
    "uploadedBy" text NOT NULL,
    "confirmationsRequestedFrom" text[],
    "confirmedBy" text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public.uploads;
       public         heap    qualkey    false    659    659         �            1259    17597    userActions    TABLE     �  CREATE TABLE public."userActions" (
    id integer NOT NULL,
    status public."UserActionStatus" DEFAULT 'ACTIVE'::public."UserActionStatus" NOT NULL,
    "userUuid" text NOT NULL,
    "initiatorName" text NOT NULL,
    type public."UserActionType" NOT NULL,
    "subjectUuid" text NOT NULL,
    "credentialsUuid" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 !   DROP TABLE public."userActions";
       public         heap    qualkey    false    668    668    665         �            1259    17595    userActions_id_seq    SEQUENCE     �   CREATE SEQUENCE public."userActions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."userActions_id_seq";
       public          qualkey    false    212         �           0    0    userActions_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."userActions_id_seq" OWNED BY public."userActions".id;
          public          qualkey    false    211         �            1259    17511    users    TABLE     x  CREATE TABLE public.users (
    uuid text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" NOT NULL,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "fullName" text,
    currency text DEFAULT 'GBP'::text NOT NULL,
    "stripeCustomerId" text,
    "signatureUrl" text,
    title text,
    "institutionUuid" text,
    "subscribedToEmails" boolean DEFAULT true NOT NULL
);
    DROP TABLE public.users;
       public         heap    qualkey    false    650    647    650         �           2604    18323    credentialChanges id    DEFAULT     �   ALTER TABLE ONLY public."credentialChanges" ALTER COLUMN id SET DEFAULT nextval('public."credentialChanges_id_seq"'::regclass);
 E   ALTER TABLE public."credentialChanges" ALTER COLUMN id DROP DEFAULT;
       public          qualkey    false    206    207    207         �           2604    18296    institutionStats id    DEFAULT     ~   ALTER TABLE ONLY public."institutionStats" ALTER COLUMN id SET DEFAULT nextval('public."institutionStats_id_seq"'::regclass);
 D   ALTER TABLE public."institutionStats" ALTER COLUMN id DROP DEFAULT;
       public          qualkey    false    220    219    220         �           2604    17639    systemSettings id    DEFAULT     z   ALTER TABLE ONLY public."systemSettings" ALTER COLUMN id SET DEFAULT nextval('public."systemSettings_id_seq"'::regclass);
 B   ALTER TABLE public."systemSettings" ALTER COLUMN id DROP DEFAULT;
       public          qualkey    false    217    216    217         �           2604    17588    transactions id    DEFAULT     r   ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);
 >   ALTER TABLE public.transactions ALTER COLUMN id DROP DEFAULT;
       public          qualkey    false    210    209    210         �           2604    17600    userActions id    DEFAULT     t   ALTER TABLE ONLY public."userActions" ALTER COLUMN id SET DEFAULT nextval('public."userActions_id_seq"'::regclass);
 ?   ALTER TABLE public."userActions" ALTER COLUMN id DROP DEFAULT;
       public          qualkey    false    212    211    212         �          0    17407    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public          qualkey    false    200       3206.dat �          0    17573    credentialChangeRequests 
   TABLE DATA           �   COPY public."credentialChangeRequests" (uuid, "credentialUuid", status, "requestedBy", "confirmationRequestedFrom", "confirmedBy", "changeFrom", "changeTo", "fieldName", "createdAt", "updatedAt") FROM stdin;
    public          qualkey    false    208       3214.dat �          0    17563    credentialChanges 
   TABLE DATA           �   COPY public."credentialChanges" (id, "credentialUuid", "credentialDid", "changedByUuid", "changedFrom", "changedTo", "fieldName", "createdAt", hash, "smartContractId", "transactionHash", "transactionId") FROM stdin;
    public          qualkey    false    207       3213.dat �          0    17552    credentialShares 
   TABLE DATA           �   COPY public."credentialShares" (uuid, "sharedBy", "recipientEmails", "credentialUuids", "credentialQualificationNames", "sharedFields", "temporaryPassword", "expiresAt", "createdAt") FROM stdin;
    public          qualkey    false    205       3211.dat �          0    17522    credentials 
   TABLE DATA           �  COPY public.credentials (uuid, status, "studentUuid", "institutionUuid", "uploadUuid", did, "certificateId", "graduatedName", "qualificationName", majors, minors, "awardingInstitution", "qualificationLevel", "awardLevel", "studyLanguage", info, "gpaFinalGrade", "studyStartedAt", "studyEndedAt", "graduatedAt", "expiresAt", "authenticatedAt", "authenticatedBy", "authenticatedTitle", "createdAt", "updatedAt") FROM stdin;
    public          qualkey    false    202       3208.dat �          0    17608    credentialsWithdrawalRequests 
   TABLE DATA           �   COPY public."credentialsWithdrawalRequests" (uuid, "credentialsUuid", status, "initiatedBy", "confirmationsRequestedFrom", "confirmedBy", "createdAt", "updatedAt") FROM stdin;
    public          qualkey    false    213       3219.dat �          0    18293    institutionStats 
   TABLE DATA           	  COPY public."institutionStats" (id, "institutionUuid", "totalQualifications", "withdrawnQualifications", "editedQualifications", "sharedQualifications", "deletedQualifications", "activatedQualifications", "qualificationNames", "createdAt", "updatedAt") FROM stdin;
    public          qualkey    false    220       3226.dat �          0    17532    institutions 
   TABLE DATA           �   COPY public.institutions (uuid, status, "emailDomain", "logoUrl", "stampUrl", name, "createdAt", "updatedAt", mapping) FROM stdin;
    public          qualkey    false    203       3209.dat �          0    17618    oneTimePasswords 
   TABLE DATA           W   COPY public."oneTimePasswords" (uuid, code, "validUntil", "canBeResentAt") FROM stdin;
    public          qualkey    false    214       3220.dat �          0    17646    payments 
   TABLE DATA           �   COPY public.payments (uuid, "externalId", "studentUuid", status, amount, currency, method, "createdAt", "credentialUuids") FROM stdin;
    public          qualkey    false    218       3224.dat �          0    17626    smartContracts 
   TABLE DATA           D   COPY public."smartContracts" (id, status, "deployedAt") FROM stdin;
    public          qualkey    false    215       3221.dat �          0    17636    systemSettings 
   TABLE DATA           U   COPY public."systemSettings" (id, name, value, "createdAt", "updatedAt") FROM stdin;
    public          qualkey    false    217       3223.dat �          0    17585    transactions 
   TABLE DATA           �   COPY public.transactions (id, "credentialUuid", fee, "transactionId", type, "smartContractId", "createdAt", "transactionHash") FROM stdin;
    public          qualkey    false    210       3216.dat �          0    17542    uploads 
   TABLE DATA           �   COPY public.uploads (uuid, filename, "originalFilename", mapping, status, "uploadedBy", "confirmationsRequestedFrom", "confirmedBy", "createdAt", "updatedAt") FROM stdin;
    public          qualkey    false    204       3210.dat �          0    17597    userActions 
   TABLE DATA           �   COPY public."userActions" (id, status, "userUuid", "initiatorName", type, "subjectUuid", "credentialsUuid", "createdAt") FROM stdin;
    public          qualkey    false    212       3218.dat �          0    17511    users 
   TABLE DATA           �   COPY public.users (uuid, email, password, role, status, "createdAt", "updatedAt", "lastLoginAt", "fullName", currency, "stripeCustomerId", "signatureUrl", title, "institutionUuid", "subscribedToEmails") FROM stdin;
    public          qualkey    false    201       3207.dat �           0    0    credentialChanges_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public."credentialChanges_id_seq"', 1, false);
          public          qualkey    false    206         �           0    0    institutionStats_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public."institutionStats_id_seq"', 1, true);
          public          qualkey    false    219         �           0    0    systemSettings_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."systemSettings_id_seq"', 2, true);
          public          qualkey    false    216         �           0    0    transactions_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.transactions_id_seq', 36, true);
          public          qualkey    false    209         �           0    0    userActions_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."userActions_id_seq"', 1, true);
          public          qualkey    false    211         �           2606    17416 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       public            qualkey    false    200         �           2606    17582 6   credentialChangeRequests credentialChangeRequests_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public."credentialChangeRequests"
    ADD CONSTRAINT "credentialChangeRequests_pkey" PRIMARY KEY (uuid);
 d   ALTER TABLE ONLY public."credentialChangeRequests" DROP CONSTRAINT "credentialChangeRequests_pkey";
       public            qualkey    false    208         �           2606    17572 (   credentialChanges credentialChanges_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public."credentialChanges"
    ADD CONSTRAINT "credentialChanges_pkey" PRIMARY KEY (id);
 V   ALTER TABLE ONLY public."credentialChanges" DROP CONSTRAINT "credentialChanges_pkey";
       public            qualkey    false    207         �           2606    17560 &   credentialShares credentialShares_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public."credentialShares"
    ADD CONSTRAINT "credentialShares_pkey" PRIMARY KEY (uuid);
 T   ALTER TABLE ONLY public."credentialShares" DROP CONSTRAINT "credentialShares_pkey";
       public            qualkey    false    205         �           2606    17617 @   credentialsWithdrawalRequests credentialsWithdrawalRequests_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."credentialsWithdrawalRequests"
    ADD CONSTRAINT "credentialsWithdrawalRequests_pkey" PRIMARY KEY (uuid);
 n   ALTER TABLE ONLY public."credentialsWithdrawalRequests" DROP CONSTRAINT "credentialsWithdrawalRequests_pkey";
       public            qualkey    false    213         �           2606    17531    credentials credentials_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT credentials_pkey PRIMARY KEY (uuid);
 F   ALTER TABLE ONLY public.credentials DROP CONSTRAINT credentials_pkey;
       public            qualkey    false    202         �           2606    18308 &   institutionStats institutionStats_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public."institutionStats"
    ADD CONSTRAINT "institutionStats_pkey" PRIMARY KEY (id);
 T   ALTER TABLE ONLY public."institutionStats" DROP CONSTRAINT "institutionStats_pkey";
       public            qualkey    false    220         �           2606    17541    institutions institutions_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.institutions
    ADD CONSTRAINT institutions_pkey PRIMARY KEY (uuid);
 H   ALTER TABLE ONLY public.institutions DROP CONSTRAINT institutions_pkey;
       public            qualkey    false    203         �           2606    17625 &   oneTimePasswords oneTimePasswords_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public."oneTimePasswords"
    ADD CONSTRAINT "oneTimePasswords_pkey" PRIMARY KEY (uuid);
 T   ALTER TABLE ONLY public."oneTimePasswords" DROP CONSTRAINT "oneTimePasswords_pkey";
       public            qualkey    false    214         �           2606    17656    payments payments_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (uuid);
 @   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_pkey;
       public            qualkey    false    218         �           2606    18289 "   smartContracts smartContracts_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."smartContracts"
    ADD CONSTRAINT "smartContracts_pkey" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public."smartContracts" DROP CONSTRAINT "smartContracts_pkey";
       public            qualkey    false    215         �           2606    17645 "   systemSettings systemSettings_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."systemSettings"
    ADD CONSTRAINT "systemSettings_pkey" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public."systemSettings" DROP CONSTRAINT "systemSettings_pkey";
       public            qualkey    false    217         �           2606    17594    transactions transactions_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.transactions DROP CONSTRAINT transactions_pkey;
       public            qualkey    false    210         �           2606    17551    uploads uploads_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT uploads_pkey PRIMARY KEY (uuid);
 >   ALTER TABLE ONLY public.uploads DROP CONSTRAINT uploads_pkey;
       public            qualkey    false    204         �           2606    17607    userActions userActions_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."userActions"
    ADD CONSTRAINT "userActions_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."userActions" DROP CONSTRAINT "userActions_pkey";
       public            qualkey    false    212         �           2606    17521    users users_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uuid);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            qualkey    false    201         �           1259    17662 +   credentialChangeRequests_credentialUuid_key    INDEX     �   CREATE UNIQUE INDEX "credentialChangeRequests_credentialUuid_key" ON public."credentialChangeRequests" USING btree ("credentialUuid");
 A   DROP INDEX public."credentialChangeRequests_credentialUuid_key";
       public            qualkey    false    208         �           1259    17661    credentialChanges_hash_key    INDEX     c   CREATE UNIQUE INDEX "credentialChanges_hash_key" ON public."credentialChanges" USING btree (hash);
 0   DROP INDEX public."credentialChanges_hash_key";
       public            qualkey    false    207         �           1259    17663 1   credentialsWithdrawalRequests_credentialsUuid_key    INDEX     �   CREATE UNIQUE INDEX "credentialsWithdrawalRequests_credentialsUuid_key" ON public."credentialsWithdrawalRequests" USING btree ("credentialsUuid");
 G   DROP INDEX public."credentialsWithdrawalRequests_credentialsUuid_key";
       public            qualkey    false    213         �           1259    17659    credentials_did_key    INDEX     Q   CREATE UNIQUE INDEX credentials_did_key ON public.credentials USING btree (did);
 '   DROP INDEX public.credentials_did_key;
       public            qualkey    false    202         �           1259    18309 $   institutionStats_institutionUuid_key    INDEX     y   CREATE UNIQUE INDEX "institutionStats_institutionUuid_key" ON public."institutionStats" USING btree ("institutionUuid");
 :   DROP INDEX public."institutionStats_institutionUuid_key";
       public            qualkey    false    220         �           1259    17660    institutions_emailDomain_key    INDEX     g   CREATE UNIQUE INDEX "institutions_emailDomain_key" ON public.institutions USING btree ("emailDomain");
 2   DROP INDEX public."institutions_emailDomain_key";
       public            qualkey    false    203         �           1259    17666    payments_externalId_key    INDEX     ]   CREATE UNIQUE INDEX "payments_externalId_key" ON public.payments USING btree ("externalId");
 -   DROP INDEX public."payments_externalId_key";
       public            qualkey    false    218         �           1259    17664    smartContracts_id_key    INDEX     Y   CREATE UNIQUE INDEX "smartContracts_id_key" ON public."smartContracts" USING btree (id);
 +   DROP INDEX public."smartContracts_id_key";
       public            qualkey    false    215         �           1259    17665    systemSettings_name_key    INDEX     ]   CREATE UNIQUE INDEX "systemSettings_name_key" ON public."systemSettings" USING btree (name);
 -   DROP INDEX public."systemSettings_name_key";
       public            qualkey    false    217         �           1259    18310     transactions_transactionHash_key    INDEX     o   CREATE UNIQUE INDEX "transactions_transactionHash_key" ON public.transactions USING btree ("transactionHash");
 6   DROP INDEX public."transactions_transactionHash_key";
       public            qualkey    false    210         �           1259    17657    users_email_key    INDEX     I   CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);
 #   DROP INDEX public.users_email_key;
       public            qualkey    false    201         �           1259    17658    users_stripeCustomerId_key    INDEX     c   CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON public.users USING btree ("stripeCustomerId");
 0   DROP INDEX public."users_stripeCustomerId_key";
       public            qualkey    false    201                    2606    17687 7   credentialChanges credentialChanges_credentialUuid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."credentialChanges"
    ADD CONSTRAINT "credentialChanges_credentialUuid_fkey" FOREIGN KEY ("credentialUuid") REFERENCES public.credentials(uuid) ON UPDATE CASCADE ON DELETE RESTRICT;
 e   ALTER TABLE ONLY public."credentialChanges" DROP CONSTRAINT "credentialChanges_credentialUuid_fkey";
       public          qualkey    false    207    202    3033         �           2606    17677 ,   credentials credentials_institutionUuid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT "credentials_institutionUuid_fkey" FOREIGN KEY ("institutionUuid") REFERENCES public.institutions(uuid) ON UPDATE CASCADE ON DELETE RESTRICT;
 X   ALTER TABLE ONLY public.credentials DROP CONSTRAINT "credentials_institutionUuid_fkey";
       public          qualkey    false    203    202    3036         �           2606    17672 (   credentials credentials_studentUuid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT "credentials_studentUuid_fkey" FOREIGN KEY ("studentUuid") REFERENCES public.users(uuid) ON UPDATE CASCADE ON DELETE RESTRICT;
 T   ALTER TABLE ONLY public.credentials DROP CONSTRAINT "credentials_studentUuid_fkey";
       public          qualkey    false    202    3029    201                     2606    17682 '   credentials credentials_uploadUuid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT "credentials_uploadUuid_fkey" FOREIGN KEY ("uploadUuid") REFERENCES public.uploads(uuid) ON UPDATE CASCADE ON DELETE RESTRICT;
 S   ALTER TABLE ONLY public.credentials DROP CONSTRAINT "credentials_uploadUuid_fkey";
       public          qualkey    false    202    204    3038                    2606    17697 "   payments payments_studentUuid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_studentUuid_fkey" FOREIGN KEY ("studentUuid") REFERENCES public.users(uuid) ON UPDATE CASCADE ON DELETE RESTRICT;
 N   ALTER TABLE ONLY public.payments DROP CONSTRAINT "payments_studentUuid_fkey";
       public          qualkey    false    3029    201    218                    2606    17692 .   transactions transactions_smartContractId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "transactions_smartContractId_fkey" FOREIGN KEY ("smartContractId") REFERENCES public."smartContracts"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 Z   ALTER TABLE ONLY public.transactions DROP CONSTRAINT "transactions_smartContractId_fkey";
       public          qualkey    false    3057    215    210         �           2606    17667     users users_institutionUuid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_institutionUuid_fkey" FOREIGN KEY ("institutionUuid") REFERENCES public.institutions(uuid) ON UPDATE CASCADE ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.users DROP CONSTRAINT "users_institutionUuid_fkey";
       public          qualkey    false    203    201    3036                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        3206.dat                                                                                            0000600 0004000 0002000 00000002235 14350374676 0014265 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        d92aa84f-0ae6-410e-95d0-c09a8c712f99	7910aa082b6be80145762b4d8489ae13c203b1cfaddcea28d89482acadfa8de6	2022-12-20 15:17:53.064274+00	20220710183132_init	\N	\N	2022-12-20 15:17:52.984837+00	1
453b4f53-2dfc-4758-b203-89c2f233a76c	2e05c6228ae7e58bcc454a6d68d7f6ce3b2fa4a7989617cf78836468a5f7301f	2022-12-20 15:18:04.04243+00	20221220151803_test	\N	\N	2022-12-20 15:18:04.029615+00	1
4b425046-2386-4116-8618-7c3b9b605d7e	75d5da9a79d298d97e025d0e270f59e8cec26569da5a5959bf55988f13a837f0	2022-04-27 21:27:52.781552+00	20220427134050_init	\N	\N	2022-04-27 21:27:52.769912+00	1
c694e44f-e28c-4a3b-b6bb-545dcb94d1f3	75d5da9a79d298d97e025d0e270f59e8cec26569da5a5959bf55988f13a837f0	2022-04-27 13:48:56.073734+00	20220427134050_init	\N	\N	2022-04-27 13:48:56.052726+00	1
f7c4efdb-ad07-4bbf-95b3-3fe640a30f54	7f6c78e32d7eb2466d6e4ca9e1ba0ca17018f92e5703915ee06263133cc4d1e4	2022-05-06 15:36:27.156577+00	20220429224530_update_models_30_04	\N	\N	2022-05-06 15:36:27.120806+00	1
13f5e6ea-245c-4525-859f-458316a5f037	56f3d4090d8f90c1381da67d2da5ef43a843690c0e19de0405c285db4a8a6592	2022-05-06 15:36:27.163625+00	20220429225129_update_models_30_04_defaults	\N	\N	2022-05-06 15:36:27.1593+00	1
\.


                                                                                                                                                                                                                                                                                                                                                                   3214.dat                                                                                            0000600 0004000 0002000 00000000005 14350374676 0014255 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3213.dat                                                                                            0000600 0004000 0002000 00000003325 14350374676 0014264 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        72	130b275c-6865-4f1d-82ba-8516810ec979	did:hedera:testnet:EMAJMM8TUBecDH3kxyZdM4bFoawo2pt8BGYCsPhbzqjB;hedera:testnet:fid=0.0.34921762;hedera:testnet:tid=0.0.34921760	\N	\N	\N	\N	2022-12-20 17:29:10.303	662034237f8278a7dd4693e25e403f6535133c8d80da41a79fcaece9d42a4e5c	0.0.49132163	323e5c55b06522664bbebfe218baa05b37c89c00e35e264e76596e32a0bfb871f24b33ba6820ba0bd8dc375f96e3fef4	0.0.34211023@1671557390.826156129
73	aec362f3-daa8-4540-993d-1bcd9c4557c1	did:hedera:testnet:2cDnHJc7yYpw4kv4AxHyBLPwbwpQKg2KAdaGhsAakiKU;hedera:testnet:fid=0.0.34921762;hedera:testnet:tid=0.0.34921760	\N	\N	\N	\N	2022-12-20 17:29:10.652	53a76cd1c516917e459f33bcb8a18e755fb171a02813adf7c12563148e8e6c44	0.0.49132163	e9da21fb4a5f55fd32e4aeb6179cc58b01c806371a77db9efe7e78a94ff49cdc45cbe09f1f07b0c9d53afe8dc0199794	0.0.34211023@1671557393.450340769
74	54f870e7-67df-411e-bcaa-6044867cfa62	did:hedera:testnet:AiwR6duoAthQiVXAgJ6tMuwrPTFNqu3mKmGGrwKC77nw;hedera:testnet:fid=0.0.34921762;hedera:testnet:tid=0.0.34921760	\N	\N	\N	\N	2022-12-20 17:29:10.995	ea079a0be531494c84302ec74056c028185ac6a9c83fe4e9fcc6e36f50566858	0.0.49132163	f186154771f2c628fc2351e52f59448d522d972a4f778aa67005d9d24f52071ce6d12b2e48a31d9b5935c99dfa70a0a3	0.0.34211023@1671557396.141554903
75	54f870e7-67df-411e-bcaa-6044867cfa62	did:hedera:testnet:AiwR6duoAthQiVXAgJ6tMuwrPTFNqu3mKmGGrwKC77nw;hedera:testnet:fid=0.0.34921762;hedera:testnet:tid=0.0.34921760	4728859d-622b-4ec0-8f60-75caa0d17c13	{2025-12-03T10:00:00.000Z}	{2030-12-03T00:00:00+02:00}	{expiresAt}	2022-12-20 17:34:24.914	fe0ca6d0432517e9dccb1956f4cb3d1d1f573984654d5141cb558af39272f1ca	0.0.49132163	3882fc3978cbb9ce75dd8bcc829f5d25cd490742fb99d3a0f91addc598e8c75524d232c2fd4a5ae0f0654c65f59e6393	0.0.34211023@1671557652.214216876
\.


                                                                                                                                                                                                                                                                                                           3211.dat                                                                                            0000600 0004000 0002000 00000000552 14350374676 0014261 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        c0e8a9b2-6fde-442b-8a1d-b7d60f447bfd	00119957-e32d-4437-9cd5-b3b17febad4b	{kkucenko.aleksejs@gmail.com}	{54f870e7-67df-411e-bcaa-6044867cfa62}	{"Bachelors of API Development"}	{awardLevel,expiresAt,gpaFinalGrade,graduatedAt,info,majors,minors,qualificationLevel,studyEndedAt,studyLanguage,studyStartedAt}	uWCe	2022-12-22 17:44:03.782	2022-12-20 17:44:03.84
\.


                                                                                                                                                      3208.dat                                                                                            0000600 0004000 0002000 00000003207 14350374676 0014267 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        130b275c-6865-4f1d-82ba-8516810ec979	WITHDRAWN	00119957-e32d-4437-9cd5-b3b17febad4b	a0c9a366-99d9-4895-8366-39ecc157fa74	5e300286-1158-43f0-b1d4-7619eac3c2d4	did:hedera:testnet:EMAJMM8TUBecDH3kxyZdM4bFoawo2pt8BGYCsPhbzqjB;hedera:testnet:fid=0.0.34921762;hedera:testnet:tid=0.0.34921760		Aleksejs Kucenko	Bachelors of QA Testing			Test University	Bachelors		Latvian	None		2013-08-05 00:00:00	2017-05-05 00:00:00	2017-05-05 10:00:00	2025-12-03 10:00:00	2022-12-20 17:29:10.158	Alberts Giganiks	Director	2022-12-20 17:29:10.28	2022-12-20 17:32:24.276
54f870e7-67df-411e-bcaa-6044867cfa62	ACTIVATED	00119957-e32d-4437-9cd5-b3b17febad4b	a0c9a366-99d9-4895-8366-39ecc157fa74	5e300286-1158-43f0-b1d4-7619eac3c2d4	did:hedera:testnet:AiwR6duoAthQiVXAgJ6tMuwrPTFNqu3mKmGGrwKC77nw;hedera:testnet:fid=0.0.34921762;hedera:testnet:tid=0.0.34921760		Aleksejs Kucenko	Bachelors of API Development			Test University	Bachelors	Honors	Russian	None		2013-09-12 00:00:00	2017-05-06 00:00:00	2017-05-06 00:00:00	2030-12-02 22:00:00	2022-12-20 17:29:10.158	Alberts Giganiks	Director	2022-12-20 17:29:10.981	2022-12-20 17:34:24.908
aec362f3-daa8-4540-993d-1bcd9c4557c1	WITHDRAWN	00119957-e32d-4437-9cd5-b3b17febad4b	a0c9a366-99d9-4895-8366-39ecc157fa74	5e300286-1158-43f0-b1d4-7619eac3c2d4	did:hedera:testnet:2cDnHJc7yYpw4kv4AxHyBLPwbwpQKg2KAdaGhsAakiKU;hedera:testnet:fid=0.0.34921762;hedera:testnet:tid=0.0.34921760		Aleksejs Kucenko	Masters of Web Development			Test University	Bachelors	Honors	English	None		2017-08-07 00:00:00	2021-05-19 00:00:00	2021-05-05 00:00:00	2025-12-03 10:00:00	2022-12-20 17:29:10.158	Alberts Giganiks	Director	2022-12-20 17:29:10.644	2022-12-20 17:59:07.493
\.


                                                                                                                                                                                                                                                                                                                                                                                         3219.dat                                                                                            0000600 0004000 0002000 00000000005 14350374676 0014262 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        \.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           3226.dat                                                                                            0000600 0004000 0002000 00000000300 14350374676 0014256 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	a0c9a366-99d9-4895-8366-39ecc157fa74	3	2	1	1	0	1	{"Bachelors of QA Testing","Bachelors of API Development","Masters of Web Development"}	2022-12-20 16:18:02.743	2022-12-20 17:59:07.514
\.


                                                                                                                                                                                                                                                                                                                                3209.dat                                                                                            0000600 0004000 0002000 00000002743 14350374676 0014274 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        a0c9a366-99d9-4895-8366-39ecc157fa74	ACTIVE	kucenko	a0c9a366-99d9-4895-8366-39ecc157fa74/university-logo-Graphics-15000292-1.png	a0c9a366-99d9-4895-8366-39ecc157fa74/52-522794_free-png-empty-stamp-png-images-transparent-stony.png	Test University	2022-12-20 15:40:07.845	2022-12-20 17:38:45.941	[{"qualkeyName": "graduatedFirstName", "originalColumnName": "FirstName"}, {"qualkeyName": "graduatedLastName", "originalColumnName": "LastName"}, {"originalColumnName": "Date of Birth"}, {"qualkeyName": "awardLevel", "originalColumnName": "Award Level"}, {"qualkeyName": "expiresAt", "originalColumnName": "Expiration Date"}, {"qualkeyName": "studyLanguage", "originalColumnName": "Language"}, {"qualkeyName": "qualificationLevel", "originalColumnName": "Level of Qualification"}, {"qualkeyName": "info", "originalColumnName": "Other Information"}, {"qualkeyName": "qualificationName", "originalColumnName": "Qualification_Name"}, {"qualkeyName": null, "originalColumnName": "School_Name"}, {"originalColumnName": "Specialization"}, {"qualkeyName": "email", "originalColumnName": "Student Email"}, {"originalColumnName": "Student ID"}, {"originalColumnName": "Student Password"}, {"qualkeyName": "graduatedAt", "originalColumnName": "Study_Graduation Date"}, {"qualkeyName": "studyStartedAt", "originalColumnName": "Study_Start"}, {"qualkeyName": "studyEndedAt", "originalColumnName": "Study_End"}]
89f43c8f-1434-4caf-92bd-990b3f112da1	ACTIVE	web3app	\N	\N	Testio	2022-05-08 22:37:57	2022-05-08 22:37:59	\N
\.


                             3220.dat                                                                                            0000600 0004000 0002000 00000001605 14350374676 0014261 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        527924b7-dfe0-4032-b4c1-ab36b6260216	6633	2022-12-20 15:39:23.172	2022-12-20 15:34:38.172
7547242b-ea50-4eeb-bc76-030661856f41	9072	2022-12-20 15:39:53.773	2022-12-20 15:35:08.773
8bc7da19-4979-48bc-ac70-e2add16f06e6	8155	2022-12-20 17:10:39.932	2022-12-20 17:05:54.932
92123779-8972-4173-a870-89673b2ed71f	6493	2022-12-20 17:19:34.524	2022-12-20 17:14:49.524
d07abb6e-5d9e-4bb2-bf7b-f2bde4c56719	1427	2022-12-20 17:22:18.8	2022-12-20 17:17:33.8
42bade32-f1a9-46f4-bf9d-1cab762e0601	5526	2022-12-20 17:25:52.386	2022-12-20 17:21:07.386
79c53f96-1853-4580-9a1a-9286244359a6	2315	2022-12-20 17:36:01.951	2022-12-20 17:31:16.951
94adc0f9-097a-475e-8fcc-6f6e5b2257ed	2348	2022-12-20 17:57:14.152	2022-12-20 17:52:29.152
7f3e1e6e-0a89-4d74-9fb6-83e8a6d48524	3079	2022-12-20 18:02:52.847	2022-12-20 17:58:07.847
e17d7efc-1350-4f35-ba6a-2c4ae1c65138	9464	2022-12-20 18:03:16.124	2022-12-20 17:58:31.124
\.


                                                                                                                           3224.dat                                                                                            0000600 0004000 0002000 00000000354 14350374676 0014265 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        38839bce-0178-4010-af44-8ef2fda8257f	cs_test_a1BozqHxmbsUKKs2m1ujjMkKOQqU7vUTqzuQa4bPVD850jXRGy0019FOQB	00119957-e32d-4437-9cd5-b3b17febad4b	COMPLETED	1999.00	GBP	card	2022-12-20 17:31:22.285	{54f870e7-67df-411e-bcaa-6044867cfa62}
\.


                                                                                                                                                                                                                                                                                    3221.dat                                                                                            0000600 0004000 0002000 00000000061 14350374676 0014255 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        0.0.49132163	ACTIVE	2022-12-20 17:00:07.699
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                               3223.dat                                                                                            0000600 0004000 0002000 00000001071 14350374676 0014261 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        2	emails.enabled	false	2022-06-06 01:57:11.954	2022-06-06 01:57:11.954
3	credentials.price.usd	price_1L76C9HqmckIsQHkMYL35Dxs	2022-06-06 01:58:07.615	2022-06-06 01:58:07.616
4	credentials.price.eur	price_1L76BmHqmckIsQHkJUAasgDe	2022-06-06 01:58:27.716	2022-06-06 01:58:27.716
5	credentials.price.gbp	price_1L75fKHqmckIsQHkjpohDUvr	2022-06-06 01:58:43.588	2022-06-06 01:58:43.588
7	otp.enabled	false	2022-12-20 17:34:44	2022-12-20 17:34:45
6	query.gas	300000	2022-12-20 17:30:27	2022-12-20 17:30:28
1	max.transaction.fee	10	2022-12-20 17:29:20	2022-12-20 17:29:21
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                                       3216.dat                                                                                            0000600 0004000 0002000 00000013111 14350374676 0014261 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        6	\N	0.92525473	0.0.34211023@1671553308.864224620	file-create	\N	2022-12-20 16:22:01.671	\N
7	\N	1.99761936	0.0.34211023@1671553309.120151508	file-append	\N	2022-12-20 16:22:04.375	\N
8	\N	0.92525473	0.0.34211023@1671553368.670569457	file-create	\N	2022-12-20 16:23:01.923	\N
9	\N	1.99761935	0.0.34211023@1671553370.561196338	file-append	\N	2022-12-20 16:23:05.344	\N
10	\N	0.92525473	0.0.34211023@1671553430.532538535	file-create	\N	2022-12-20 16:24:01.957	\N
11	\N	1.99761933	0.0.34211023@1671553432.506757979	file-append	\N	2022-12-20 16:24:06.596	\N
12	\N	0.92525473	0.0.34211023@1671553609.220950395	file-create	\N	2022-12-20 16:27:02.067	\N
13	\N	1.99761933	0.0.34211023@1671553612.590217256	file-append	\N	2022-12-20 16:27:05.481	\N
14	\N	17.848942	0.0.34211023@1671553616.317851184	contract-create	\N	2022-12-20 16:27:07.646	\N
15	0a6b3531-36d3-479e-bd6b-33fa9654f635	0.49855638 ℏ	0.0.34211023@1671555047.705237259	update-smart-contract	\N	2022-12-20 16:51:02.466	0ea71dc5e3cd0d626db3315f6e3ddbe7dadebe541c826a7627844b3d779d8da9dac8eea4de6f73503ebdc4bded474bee
16	c4619c2c-7992-48af-ae69-c9f70fd4da71	0.49855638 ℏ	0.0.34211023@1671555054.853147951	update-smart-contract	\N	2022-12-20 16:51:04.45	091f24cf9f8d2a3612e4fb840bbb981476d64310c63f812b326c169021e2f0f5e23e21a321d2af4df35f8952aa434f26
17	d6a4c5c6-2413-41b1-98fc-266c9e1be410	0.49855638 ℏ	0.0.34211023@1671555055.43668732	update-smart-contract	\N	2022-12-20 16:51:07.216	092a9ac07de727132a6d04e8133370d10abf5f553d9c7fddf59a58b91492f762881c6d3fee9d527f11a30d7602f5362d
18	555afec8-11e8-44f5-a6e1-329a23ae626e	0.49855638 ℏ	0.0.34211023@1671555054.864910297	update-smart-contract	\N	2022-12-20 16:51:09.875	3b60fe78cd597b1d9602b16b7e584fddd5f1f126bd3d295244aa19445b52cb1f1a9f2b2451dc90b491ad0791cb332e98
19	\N	0.92307219	0.0.34211023@1671555588.240114348	file-create	\N	2022-12-20 17:00:02.004	\N
20	\N	1.9929073	0.0.34211023@1671555588.696175855	file-append	\N	2022-12-20 17:00:05.481	\N
21	\N	10.26580424	0.0.34211023@1671555596.106191154	contract-create	\N	2022-12-20 17:00:07.695	\N
22	e35f3ec5-f492-40a7-a98e-71898243db65	0.496076 ℏ	0.0.34211023@1671555648.502005768	update-smart-contract	0.0.49132163	2022-12-20 17:01:02.895	c9276a5de9ab0b771501062879cf2ec8404d83360e10c70fd5deedafee328fb14368c6d442763f1b549d6040c60f2fb1
23	1ffcef4b-d984-4d86-ade5-3dfd454441b9	0.496076 ℏ	0.0.34211023@1671555651.827854828	update-smart-contract	0.0.49132163	2022-12-20 17:01:05.213	b90933b9b244beccab14aae659bf62ee3efd2355a2c5a4319a08bb6dee02cbe389779cfd63b45b0b7e6149cdc5037074
24	a5556ec9-862f-43b6-9477-5fdd20cabe66	0.496076 ℏ	0.0.34211023@1671555655.17157401	update-smart-contract	0.0.49132163	2022-12-20 17:01:07.386	c0377afd9d5dd31db8aa145ceaf69715cad6522f5041c795f115a62faaad021e70657fb4a3a124e99492482e752d9318
25	d20d2339-4af4-4df5-8cba-134b359ef192	0.496076 ℏ	0.0.34211023@1671555658.626688553	update-smart-contract	0.0.49132163	2022-12-20 17:01:10.461	accb4b0d4caab8b9b8e3809734bafa6718ad336c213dff6e423e493e8c1fc031a931b03ac39ce2aff23ecf6727264b46
26	1ffcef4b-d984-4d86-ade5-3dfd454441b9	0.496076 ℏ	0.0.34211023@1671555741.446313200	update-smart-contract	0.0.49132163	2022-12-20 17:02:32.257	717529cdec13d2f33bb44c203cbf0a6f5b5f5225f76523809bd7dc04ab941b5b0872079b39fc83201b7cb8295b1203c2
27	4cdc9fc0-0b5f-409c-b2f3-b5533131e76a	0.496076 ℏ	0.0.34211023@1671556548.626706265	update-smart-contract	0.0.49132163	2022-12-20 17:16:02.736	919101932b428c4429f81433668a2228215f637028550ae0f81a946b78c0e6af4079e9851db669123ac12ab58ae8674b
28	e6b4d036-9b43-4d72-8c23-440dd60ce157	0.496076 ℏ	0.0.34211023@1671556554.413548697	update-smart-contract	0.0.49132163	2022-12-20 17:16:05.285	c06e65acd275bb6e38d843c74c9972708162953452f12529c964eb2ba964d0951553c010c7ffd10c1eab7ce0da4288fc
29	872a7658-1284-443b-9e7e-78220236181e	0.496076 ℏ	0.0.34211023@1671556553.422043960	update-smart-contract	0.0.49132163	2022-12-20 17:16:08.263	c1c6bc97b6a4b20f314d4a64044c381d09602984152e4e40ee1fca9ae981740200671714fae3e989c5cfc7f8cdae80c7
30	caa752a5-7a29-4132-b1c0-46e4181660b0	0.496076 ℏ	0.0.34211023@1671556555.587792120	update-smart-contract	0.0.49132163	2022-12-20 17:16:11.731	0618860281fda1e35347ef886a76214d120a59e3703139b4232901ca1308ddde22c66e974ccba2aa1f8a4af917d8636d
31	4cdc9fc0-0b5f-409c-b2f3-b5533131e76a	0.496076 ℏ	0.0.34211023@1671556999.761195633	update-smart-contract	0.0.49132163	2022-12-20 17:23:32.711	102667973fd52318ee587ca2fcbfdf15f92aff6669e664c4ad302923e7a997f2e5b844a5395539368cee89c0cb8c9997
32	4cdc9fc0-0b5f-409c-b2f3-b5533131e76a	0.496076 ℏ	0.0.34211023@1671557017.326474728	update-smart-contract	0.0.49132163	2022-12-20 17:23:49.362	30ce8d705abc50db09f65f46cf58bfa60a1667676a73c377abbae42b68b4e7ccdb3f28eff72cfb103db31c820e27e903
33	130b275c-6865-4f1d-82ba-8516810ec979	0.496076 ℏ	0.0.34211023@1671557390.826156129	update-smart-contract	0.0.49132163	2022-12-20 17:30:02.531	323e5c55b06522664bbebfe218baa05b37c89c00e35e264e76596e32a0bfb871f24b33ba6820ba0bd8dc375f96e3fef4
34	aec362f3-daa8-4540-993d-1bcd9c4557c1	0.496076 ℏ	0.0.34211023@1671557393.450340769	update-smart-contract	0.0.49132163	2022-12-20 17:30:05.909	e9da21fb4a5f55fd32e4aeb6179cc58b01c806371a77db9efe7e78a94ff49cdc45cbe09f1f07b0c9d53afe8dc0199794
35	54f870e7-67df-411e-bcaa-6044867cfa62	0.496076 ℏ	0.0.34211023@1671557396.141554903	update-smart-contract	0.0.49132163	2022-12-20 17:30:08.69	f186154771f2c628fc2351e52f59448d522d972a4f778aa67005d9d24f52071ce6d12b2e48a31d9b5935c99dfa70a0a3
36	54f870e7-67df-411e-bcaa-6044867cfa62	0.496076 ℏ	0.0.34211023@1671557652.214216876	update-smart-contract	0.0.49132163	2022-12-20 17:34:27.258	3882fc3978cbb9ce75dd8bcc829f5d25cd490742fb99d3a0f91addc598e8c75524d232c2fd4a5ae0f0654c65f59e6393
\.


                                                                                                                                                                                                                                                                                                                                                                                                                                                       3210.dat                                                                                            0000600 0004000 0002000 00000000553 14350374676 0014261 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        5e300286-1158-43f0-b1d4-7619eac3c2d4	5e300286-1158-43f0-b1d4-7619eac3c2d4.csv	qk_NEW2k23.csv	graduatedFirstName,graduatedLastName,,awardLevel,expiresAt,studyLanguage,qualificationLevel,info,qualificationName,,,email,,,graduatedAt,studyStartedAt,studyEndedAt	APPROVED	4728859d-622b-4ec0-8f60-75caa0d17c13	{}	\N	2022-12-20 17:29:09.837	2022-12-20 17:29:09.851
\.


                                                                                                                                                     3218.dat                                                                                            0000600 0004000 0002000 00000000301 14350374676 0014260 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        1	DECISION_MADE	4728859d-622b-4ec0-8f60-75caa0d17c13	Aleksandra Kucenko	REVIEW_WITHDRAWAL	a4fd40c8-bb38-4ee6-b811-bcae1c46c39c	aec362f3-daa8-4540-993d-1bcd9c4557c1	2022-12-20 17:58:30.203
\.


                                                                                                                                                                                                                                                                                                                               3207.dat                                                                                            0000600 0004000 0002000 00000002276 14350374676 0014273 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        00119957-e32d-4437-9cd5-b3b17febad4b	aleksejs@kucenko.dev	$2a$10$/xJNwdhgR3CFEzKfrHVI5.KyNQfduLvbFtVo4hyEY50fjy8031ihS	STUDENT	ACTIVE	2022-12-20 17:29:10.262	2022-12-20 17:31:37.218	2022-12-20 17:31:03.031	Aleksejs Kucenko	GBP	cus_N1C3kKkxhXbLJh	\N	\N	\N	t
00e5daba-fd08-4146-af73-deb67e6dd2ea	admin@admin.com	$2a$10$6X/3no1.v5A3ygHPMGF7a.FKaOa2TkekqsWIq9ADRBOOm8Y1CcrgW	SUPER_ADMIN	ACTIVE	2022-04-27 22:11:34	2022-12-20 17:37:41	2022-12-20 17:37:42	Admin	GBP	3		\N	\N	t
4728859d-622b-4ec0-8f60-75caa0d17c13	institution@institution.com	$2a$10$.5Gcwpy7c6dwQ1UmovHaFu.z5ZAIt2wrde1wlwwuDW6HFPAs8EWZK	INSTITUTION_REPRESENTATIVE	ACTIVE	2022-06-06 01:59:11.696	2022-12-20 17:57:54.07	2022-12-20 17:57:54.068	Alberts Giganiks	GBP	1	4728859d-622b-4ec0-8f60-75caa0d17c13/1024px-Chris_Hemsworth_Signature.png	Director	a0c9a366-99d9-4895-8366-39ecc157fa74	t
0ee90a96-3ecc-475c-85a7-9355caaf8aef	ak@ak.com	$2a$10$7QM8pE2gISln3yrH9/fCruJeKksTUU8InaAWi8zFw8XguQju./7Aq	INSTITUTION_REPRESENTATIVE	ACTIVE	2022-12-20 17:57:35.936	2022-12-20 17:58:24.065	2022-12-20 17:58:17.072	Aleksandra Kucenko	GBP	\N	0ee90a96-3ecc-475c-85a7-9355caaf8aef/1024px-Chris_Hemsworth_Signature.png	Director	a0c9a366-99d9-4895-8366-39ecc157fa74	t
\.


                                                                                                                                                                                                                                                                                                                                  restore.sql                                                                                         0000600 0004000 0002000 00000100701 14350374676 0015402 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 13.9 (Debian 13.9-1.pgdg110+1)
-- Dumped by pg_dump version 13.9 (Debian 13.9-1.pgdg110+1)

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

DROP DATABASE qualkey;
--
-- Name: qualkey; Type: DATABASE; Schema: -; Owner: qualkey
--

CREATE DATABASE qualkey WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE qualkey OWNER TO qualkey;

\connect qualkey

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
-- Name: CredentialChangeRequestStatus; Type: TYPE; Schema: public; Owner: qualkey
--

CREATE TYPE public."CredentialChangeRequestStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."CredentialChangeRequestStatus" OWNER TO qualkey;

--
-- Name: CredentialStatus; Type: TYPE; Schema: public; Owner: qualkey
--

CREATE TYPE public."CredentialStatus" AS ENUM (
    'NEW',
    'UPLOADING_TO_BLOCKCHAIN',
    'FAILED_UPLOADING_TO_BLOCKCHAIN',
    'UPLOADED_TO_BLOCKCHAIN',
    'ACTIVATED',
    'WITHDRAWN',
    'EXPIRED',
    'DELETED'
);


ALTER TYPE public."CredentialStatus" OWNER TO qualkey;

--
-- Name: CredentialsWithdrawalRequestStatus; Type: TYPE; Schema: public; Owner: qualkey
--

CREATE TYPE public."CredentialsWithdrawalRequestStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."CredentialsWithdrawalRequestStatus" OWNER TO qualkey;

--
-- Name: InsitutionStatus; Type: TYPE; Schema: public; Owner: qualkey
--

CREATE TYPE public."InsitutionStatus" AS ENUM (
    'ACTIVE',
    'CLOSED'
);


ALTER TYPE public."InsitutionStatus" OWNER TO qualkey;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: qualkey
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED'
);


ALTER TYPE public."PaymentStatus" OWNER TO qualkey;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: qualkey
--

CREATE TYPE public."Role" AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'INSTITUTION_REPRESENTATIVE',
    'STUDENT'
);


ALTER TYPE public."Role" OWNER TO qualkey;

--
-- Name: SmartContractStatus; Type: TYPE; Schema: public; Owner: qualkey
--

CREATE TYPE public."SmartContractStatus" AS ENUM (
    'ACTIVE',
    'STORAGE_EXCEEDED'
);


ALTER TYPE public."SmartContractStatus" OWNER TO qualkey;

--
-- Name: TransactionStatus; Type: TYPE; Schema: public; Owner: qualkey
--

CREATE TYPE public."TransactionStatus" AS ENUM (
    'NEW',
    'PENDING',
    'CONFIRMED',
    'FAILED'
);


ALTER TYPE public."TransactionStatus" OWNER TO qualkey;

--
-- Name: UploadStatus; Type: TYPE; Schema: public; Owner: qualkey
--

CREATE TYPE public."UploadStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."UploadStatus" OWNER TO qualkey;

--
-- Name: UserActionStatus; Type: TYPE; Schema: public; Owner: qualkey
--

CREATE TYPE public."UserActionStatus" AS ENUM (
    'ACTIVE',
    'DECISION_MADE'
);


ALTER TYPE public."UserActionStatus" OWNER TO qualkey;

--
-- Name: UserActionType; Type: TYPE; Schema: public; Owner: qualkey
--

CREATE TYPE public."UserActionType" AS ENUM (
    'REVIEW_UPLOAD',
    'REVIEW_WITHDRAWAL',
    'REVIEW_CHANGE_REQUEST'
);


ALTER TYPE public."UserActionType" OWNER TO qualkey;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: qualkey
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'CLOSED',
    'BANNED',
    'DELETED'
);


ALTER TYPE public."UserStatus" OWNER TO qualkey;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: qualkey
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO qualkey;

--
-- Name: credentialChangeRequests; Type: TABLE; Schema: public; Owner: qualkey
--

CREATE TABLE public."credentialChangeRequests" (
    uuid text NOT NULL,
    "credentialUuid" text NOT NULL,
    status public."CredentialChangeRequestStatus" DEFAULT 'PENDING'::public."CredentialChangeRequestStatus" NOT NULL,
    "requestedBy" text NOT NULL,
    "confirmationRequestedFrom" text[],
    "confirmedBy" text,
    "changeFrom" text[],
    "changeTo" text[],
    "fieldName" text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."credentialChangeRequests" OWNER TO qualkey;

--
-- Name: credentialChanges; Type: TABLE; Schema: public; Owner: qualkey
--

CREATE TABLE public."credentialChanges" (
    id integer NOT NULL,
    "credentialUuid" text NOT NULL,
    "credentialDid" text NOT NULL,
    "changedByUuid" text,
    "changedFrom" text[],
    "changedTo" text[],
    "fieldName" text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    hash text NOT NULL,
    "smartContractId" text,
    "transactionHash" text,
    "transactionId" text
);


ALTER TABLE public."credentialChanges" OWNER TO qualkey;

--
-- Name: credentialChanges_id_seq; Type: SEQUENCE; Schema: public; Owner: qualkey
--

CREATE SEQUENCE public."credentialChanges_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."credentialChanges_id_seq" OWNER TO qualkey;

--
-- Name: credentialChanges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: qualkey
--

ALTER SEQUENCE public."credentialChanges_id_seq" OWNED BY public."credentialChanges".id;


--
-- Name: credentialShares; Type: TABLE; Schema: public; Owner: qualkey
--

CREATE TABLE public."credentialShares" (
    uuid text NOT NULL,
    "sharedBy" text NOT NULL,
    "recipientEmails" text[],
    "credentialUuids" text[],
    "credentialQualificationNames" text[],
    "sharedFields" text[],
    "temporaryPassword" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."credentialShares" OWNER TO qualkey;

--
-- Name: credentials; Type: TABLE; Schema: public; Owner: qualkey
--

CREATE TABLE public.credentials (
    uuid text NOT NULL,
    status public."CredentialStatus" DEFAULT 'NEW'::public."CredentialStatus" NOT NULL,
    "studentUuid" text NOT NULL,
    "institutionUuid" text NOT NULL,
    "uploadUuid" text NOT NULL,
    did text,
    "certificateId" text DEFAULT ''::text NOT NULL,
    "graduatedName" text DEFAULT ''::text NOT NULL,
    "qualificationName" text DEFAULT ''::text NOT NULL,
    majors text DEFAULT ''::text NOT NULL,
    minors text DEFAULT ''::text NOT NULL,
    "awardingInstitution" text DEFAULT ''::text NOT NULL,
    "qualificationLevel" text DEFAULT ''::text NOT NULL,
    "awardLevel" text DEFAULT ''::text NOT NULL,
    "studyLanguage" text DEFAULT ''::text NOT NULL,
    info text DEFAULT ''::text NOT NULL,
    "gpaFinalGrade" text DEFAULT ''::text NOT NULL,
    "studyStartedAt" timestamp(3) without time zone,
    "studyEndedAt" timestamp(3) without time zone,
    "graduatedAt" timestamp(3) without time zone,
    "expiresAt" timestamp(3) without time zone,
    "authenticatedAt" timestamp(3) without time zone,
    "authenticatedBy" text DEFAULT ''::text NOT NULL,
    "authenticatedTitle" text DEFAULT ''::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.credentials OWNER TO qualkey;

--
-- Name: credentialsWithdrawalRequests; Type: TABLE; Schema: public; Owner: qualkey
--

CREATE TABLE public."credentialsWithdrawalRequests" (
    uuid text NOT NULL,
    "credentialsUuid" text NOT NULL,
    status public."CredentialsWithdrawalRequestStatus" DEFAULT 'PENDING'::public."CredentialsWithdrawalRequestStatus" NOT NULL,
    "initiatedBy" text NOT NULL,
    "confirmationsRequestedFrom" text[],
    "confirmedBy" text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."credentialsWithdrawalRequests" OWNER TO qualkey;

--
-- Name: institutionStats; Type: TABLE; Schema: public; Owner: qualkey
--

CREATE TABLE public."institutionStats" (
    id integer NOT NULL,
    "institutionUuid" text NOT NULL,
    "totalQualifications" integer DEFAULT 0 NOT NULL,
    "withdrawnQualifications" integer DEFAULT 0 NOT NULL,
    "editedQualifications" integer DEFAULT 0 NOT NULL,
    "sharedQualifications" integer DEFAULT 0 NOT NULL,
    "deletedQualifications" integer DEFAULT 0 NOT NULL,
    "activatedQualifications" integer DEFAULT 0 NOT NULL,
    "qualificationNames" text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."institutionStats" OWNER TO qualkey;

--
-- Name: institutionStats_id_seq; Type: SEQUENCE; Schema: public; Owner: qualkey
--

CREATE SEQUENCE public."institutionStats_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."institutionStats_id_seq" OWNER TO qualkey;

--
-- Name: institutionStats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: qualkey
--

ALTER SEQUENCE public."institutionStats_id_seq" OWNED BY public."institutionStats".id;


--
-- Name: institutions; Type: TABLE; Schema: public; Owner: qualkey
--

CREATE TABLE public.institutions (
    uuid text NOT NULL,
    status public."InsitutionStatus" DEFAULT 'ACTIVE'::public."InsitutionStatus" NOT NULL,
    "emailDomain" text NOT NULL,
    "logoUrl" text,
    "stampUrl" text,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    mapping jsonb
);


ALTER TABLE public.institutions OWNER TO qualkey;

--
-- Name: oneTimePasswords; Type: TABLE; Schema: public; Owner: qualkey
--

CREATE TABLE public."oneTimePasswords" (
    uuid text NOT NULL,
    code text NOT NULL,
    "validUntil" timestamp(3) without time zone NOT NULL,
    "canBeResentAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."oneTimePasswords" OWNER TO qualkey;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: qualkey
--

CREATE TABLE public.payments (
    uuid text NOT NULL,
    "externalId" text NOT NULL,
    "studentUuid" text NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    amount numeric(10,2) DEFAULT 0.00 NOT NULL,
    currency text NOT NULL,
    method text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "credentialUuids" text[]
);


ALTER TABLE public.payments OWNER TO qualkey;

--
-- Name: smartContracts; Type: TABLE; Schema: public; Owner: qualkey
--

CREATE TABLE public."smartContracts" (
    id text NOT NULL,
    status public."SmartContractStatus" DEFAULT 'ACTIVE'::public."SmartContractStatus" NOT NULL,
    "deployedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."smartContracts" OWNER TO qualkey;

--
-- Name: systemSettings; Type: TABLE; Schema: public; Owner: qualkey
--

CREATE TABLE public."systemSettings" (
    id integer NOT NULL,
    name text NOT NULL,
    value text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."systemSettings" OWNER TO qualkey;

--
-- Name: systemSettings_id_seq; Type: SEQUENCE; Schema: public; Owner: qualkey
--

CREATE SEQUENCE public."systemSettings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."systemSettings_id_seq" OWNER TO qualkey;

--
-- Name: systemSettings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: qualkey
--

ALTER SEQUENCE public."systemSettings_id_seq" OWNED BY public."systemSettings".id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: qualkey
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    "credentialUuid" text,
    fee text,
    "transactionId" text,
    type text,
    "smartContractId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "transactionHash" text
);


ALTER TABLE public.transactions OWNER TO qualkey;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: qualkey
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transactions_id_seq OWNER TO qualkey;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: qualkey
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: uploads; Type: TABLE; Schema: public; Owner: qualkey
--

CREATE TABLE public.uploads (
    uuid text NOT NULL,
    filename text NOT NULL,
    "originalFilename" text NOT NULL,
    mapping text NOT NULL,
    status public."UploadStatus" DEFAULT 'PENDING'::public."UploadStatus" NOT NULL,
    "uploadedBy" text NOT NULL,
    "confirmationsRequestedFrom" text[],
    "confirmedBy" text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.uploads OWNER TO qualkey;

--
-- Name: userActions; Type: TABLE; Schema: public; Owner: qualkey
--

CREATE TABLE public."userActions" (
    id integer NOT NULL,
    status public."UserActionStatus" DEFAULT 'ACTIVE'::public."UserActionStatus" NOT NULL,
    "userUuid" text NOT NULL,
    "initiatorName" text NOT NULL,
    type public."UserActionType" NOT NULL,
    "subjectUuid" text NOT NULL,
    "credentialsUuid" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."userActions" OWNER TO qualkey;

--
-- Name: userActions_id_seq; Type: SEQUENCE; Schema: public; Owner: qualkey
--

CREATE SEQUENCE public."userActions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."userActions_id_seq" OWNER TO qualkey;

--
-- Name: userActions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: qualkey
--

ALTER SEQUENCE public."userActions_id_seq" OWNED BY public."userActions".id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: qualkey
--

CREATE TABLE public.users (
    uuid text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" NOT NULL,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "fullName" text,
    currency text DEFAULT 'GBP'::text NOT NULL,
    "stripeCustomerId" text,
    "signatureUrl" text,
    title text,
    "institutionUuid" text,
    "subscribedToEmails" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.users OWNER TO qualkey;

--
-- Name: credentialChanges id; Type: DEFAULT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public."credentialChanges" ALTER COLUMN id SET DEFAULT nextval('public."credentialChanges_id_seq"'::regclass);


--
-- Name: institutionStats id; Type: DEFAULT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public."institutionStats" ALTER COLUMN id SET DEFAULT nextval('public."institutionStats_id_seq"'::regclass);


--
-- Name: systemSettings id; Type: DEFAULT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public."systemSettings" ALTER COLUMN id SET DEFAULT nextval('public."systemSettings_id_seq"'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: userActions id; Type: DEFAULT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public."userActions" ALTER COLUMN id SET DEFAULT nextval('public."userActions_id_seq"'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: qualkey
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
\.
COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM '$$PATH$$/3206.dat';

--
-- Data for Name: credentialChangeRequests; Type: TABLE DATA; Schema: public; Owner: qualkey
--

COPY public."credentialChangeRequests" (uuid, "credentialUuid", status, "requestedBy", "confirmationRequestedFrom", "confirmedBy", "changeFrom", "changeTo", "fieldName", "createdAt", "updatedAt") FROM stdin;
\.
COPY public."credentialChangeRequests" (uuid, "credentialUuid", status, "requestedBy", "confirmationRequestedFrom", "confirmedBy", "changeFrom", "changeTo", "fieldName", "createdAt", "updatedAt") FROM '$$PATH$$/3214.dat';

--
-- Data for Name: credentialChanges; Type: TABLE DATA; Schema: public; Owner: qualkey
--

COPY public."credentialChanges" (id, "credentialUuid", "credentialDid", "changedByUuid", "changedFrom", "changedTo", "fieldName", "createdAt", hash, "smartContractId", "transactionHash", "transactionId") FROM stdin;
\.
COPY public."credentialChanges" (id, "credentialUuid", "credentialDid", "changedByUuid", "changedFrom", "changedTo", "fieldName", "createdAt", hash, "smartContractId", "transactionHash", "transactionId") FROM '$$PATH$$/3213.dat';

--
-- Data for Name: credentialShares; Type: TABLE DATA; Schema: public; Owner: qualkey
--

COPY public."credentialShares" (uuid, "sharedBy", "recipientEmails", "credentialUuids", "credentialQualificationNames", "sharedFields", "temporaryPassword", "expiresAt", "createdAt") FROM stdin;
\.
COPY public."credentialShares" (uuid, "sharedBy", "recipientEmails", "credentialUuids", "credentialQualificationNames", "sharedFields", "temporaryPassword", "expiresAt", "createdAt") FROM '$$PATH$$/3211.dat';

--
-- Data for Name: credentials; Type: TABLE DATA; Schema: public; Owner: qualkey
--

COPY public.credentials (uuid, status, "studentUuid", "institutionUuid", "uploadUuid", did, "certificateId", "graduatedName", "qualificationName", majors, minors, "awardingInstitution", "qualificationLevel", "awardLevel", "studyLanguage", info, "gpaFinalGrade", "studyStartedAt", "studyEndedAt", "graduatedAt", "expiresAt", "authenticatedAt", "authenticatedBy", "authenticatedTitle", "createdAt", "updatedAt") FROM stdin;
\.
COPY public.credentials (uuid, status, "studentUuid", "institutionUuid", "uploadUuid", did, "certificateId", "graduatedName", "qualificationName", majors, minors, "awardingInstitution", "qualificationLevel", "awardLevel", "studyLanguage", info, "gpaFinalGrade", "studyStartedAt", "studyEndedAt", "graduatedAt", "expiresAt", "authenticatedAt", "authenticatedBy", "authenticatedTitle", "createdAt", "updatedAt") FROM '$$PATH$$/3208.dat';

--
-- Data for Name: credentialsWithdrawalRequests; Type: TABLE DATA; Schema: public; Owner: qualkey
--

COPY public."credentialsWithdrawalRequests" (uuid, "credentialsUuid", status, "initiatedBy", "confirmationsRequestedFrom", "confirmedBy", "createdAt", "updatedAt") FROM stdin;
\.
COPY public."credentialsWithdrawalRequests" (uuid, "credentialsUuid", status, "initiatedBy", "confirmationsRequestedFrom", "confirmedBy", "createdAt", "updatedAt") FROM '$$PATH$$/3219.dat';

--
-- Data for Name: institutionStats; Type: TABLE DATA; Schema: public; Owner: qualkey
--

COPY public."institutionStats" (id, "institutionUuid", "totalQualifications", "withdrawnQualifications", "editedQualifications", "sharedQualifications", "deletedQualifications", "activatedQualifications", "qualificationNames", "createdAt", "updatedAt") FROM stdin;
\.
COPY public."institutionStats" (id, "institutionUuid", "totalQualifications", "withdrawnQualifications", "editedQualifications", "sharedQualifications", "deletedQualifications", "activatedQualifications", "qualificationNames", "createdAt", "updatedAt") FROM '$$PATH$$/3226.dat';

--
-- Data for Name: institutions; Type: TABLE DATA; Schema: public; Owner: qualkey
--

COPY public.institutions (uuid, status, "emailDomain", "logoUrl", "stampUrl", name, "createdAt", "updatedAt", mapping) FROM stdin;
\.
COPY public.institutions (uuid, status, "emailDomain", "logoUrl", "stampUrl", name, "createdAt", "updatedAt", mapping) FROM '$$PATH$$/3209.dat';

--
-- Data for Name: oneTimePasswords; Type: TABLE DATA; Schema: public; Owner: qualkey
--

COPY public."oneTimePasswords" (uuid, code, "validUntil", "canBeResentAt") FROM stdin;
\.
COPY public."oneTimePasswords" (uuid, code, "validUntil", "canBeResentAt") FROM '$$PATH$$/3220.dat';

--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: qualkey
--

COPY public.payments (uuid, "externalId", "studentUuid", status, amount, currency, method, "createdAt", "credentialUuids") FROM stdin;
\.
COPY public.payments (uuid, "externalId", "studentUuid", status, amount, currency, method, "createdAt", "credentialUuids") FROM '$$PATH$$/3224.dat';

--
-- Data for Name: smartContracts; Type: TABLE DATA; Schema: public; Owner: qualkey
--

COPY public."smartContracts" (id, status, "deployedAt") FROM stdin;
\.
COPY public."smartContracts" (id, status, "deployedAt") FROM '$$PATH$$/3221.dat';

--
-- Data for Name: systemSettings; Type: TABLE DATA; Schema: public; Owner: qualkey
--

COPY public."systemSettings" (id, name, value, "createdAt", "updatedAt") FROM stdin;
\.
COPY public."systemSettings" (id, name, value, "createdAt", "updatedAt") FROM '$$PATH$$/3223.dat';

--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: qualkey
--

COPY public.transactions (id, "credentialUuid", fee, "transactionId", type, "smartContractId", "createdAt", "transactionHash") FROM stdin;
\.
COPY public.transactions (id, "credentialUuid", fee, "transactionId", type, "smartContractId", "createdAt", "transactionHash") FROM '$$PATH$$/3216.dat';

--
-- Data for Name: uploads; Type: TABLE DATA; Schema: public; Owner: qualkey
--

COPY public.uploads (uuid, filename, "originalFilename", mapping, status, "uploadedBy", "confirmationsRequestedFrom", "confirmedBy", "createdAt", "updatedAt") FROM stdin;
\.
COPY public.uploads (uuid, filename, "originalFilename", mapping, status, "uploadedBy", "confirmationsRequestedFrom", "confirmedBy", "createdAt", "updatedAt") FROM '$$PATH$$/3210.dat';

--
-- Data for Name: userActions; Type: TABLE DATA; Schema: public; Owner: qualkey
--

COPY public."userActions" (id, status, "userUuid", "initiatorName", type, "subjectUuid", "credentialsUuid", "createdAt") FROM stdin;
\.
COPY public."userActions" (id, status, "userUuid", "initiatorName", type, "subjectUuid", "credentialsUuid", "createdAt") FROM '$$PATH$$/3218.dat';

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: qualkey
--

COPY public.users (uuid, email, password, role, status, "createdAt", "updatedAt", "lastLoginAt", "fullName", currency, "stripeCustomerId", "signatureUrl", title, "institutionUuid", "subscribedToEmails") FROM stdin;
\.
COPY public.users (uuid, email, password, role, status, "createdAt", "updatedAt", "lastLoginAt", "fullName", currency, "stripeCustomerId", "signatureUrl", title, "institutionUuid", "subscribedToEmails") FROM '$$PATH$$/3207.dat';

--
-- Name: credentialChanges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: qualkey
--

SELECT pg_catalog.setval('public."credentialChanges_id_seq"', 1, false);


--
-- Name: institutionStats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: qualkey
--

SELECT pg_catalog.setval('public."institutionStats_id_seq"', 1, true);


--
-- Name: systemSettings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: qualkey
--

SELECT pg_catalog.setval('public."systemSettings_id_seq"', 2, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: qualkey
--

SELECT pg_catalog.setval('public.transactions_id_seq', 36, true);


--
-- Name: userActions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: qualkey
--

SELECT pg_catalog.setval('public."userActions_id_seq"', 1, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: credentialChangeRequests credentialChangeRequests_pkey; Type: CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public."credentialChangeRequests"
    ADD CONSTRAINT "credentialChangeRequests_pkey" PRIMARY KEY (uuid);


--
-- Name: credentialChanges credentialChanges_pkey; Type: CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public."credentialChanges"
    ADD CONSTRAINT "credentialChanges_pkey" PRIMARY KEY (id);


--
-- Name: credentialShares credentialShares_pkey; Type: CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public."credentialShares"
    ADD CONSTRAINT "credentialShares_pkey" PRIMARY KEY (uuid);


--
-- Name: credentialsWithdrawalRequests credentialsWithdrawalRequests_pkey; Type: CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public."credentialsWithdrawalRequests"
    ADD CONSTRAINT "credentialsWithdrawalRequests_pkey" PRIMARY KEY (uuid);


--
-- Name: credentials credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT credentials_pkey PRIMARY KEY (uuid);


--
-- Name: institutionStats institutionStats_pkey; Type: CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public."institutionStats"
    ADD CONSTRAINT "institutionStats_pkey" PRIMARY KEY (id);


--
-- Name: institutions institutions_pkey; Type: CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public.institutions
    ADD CONSTRAINT institutions_pkey PRIMARY KEY (uuid);


--
-- Name: oneTimePasswords oneTimePasswords_pkey; Type: CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public."oneTimePasswords"
    ADD CONSTRAINT "oneTimePasswords_pkey" PRIMARY KEY (uuid);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (uuid);


--
-- Name: smartContracts smartContracts_pkey; Type: CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public."smartContracts"
    ADD CONSTRAINT "smartContracts_pkey" PRIMARY KEY (id);


--
-- Name: systemSettings systemSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public."systemSettings"
    ADD CONSTRAINT "systemSettings_pkey" PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: uploads uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT uploads_pkey PRIMARY KEY (uuid);


--
-- Name: userActions userActions_pkey; Type: CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public."userActions"
    ADD CONSTRAINT "userActions_pkey" PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uuid);


--
-- Name: credentialChangeRequests_credentialUuid_key; Type: INDEX; Schema: public; Owner: qualkey
--

CREATE UNIQUE INDEX "credentialChangeRequests_credentialUuid_key" ON public."credentialChangeRequests" USING btree ("credentialUuid");


--
-- Name: credentialChanges_hash_key; Type: INDEX; Schema: public; Owner: qualkey
--

CREATE UNIQUE INDEX "credentialChanges_hash_key" ON public."credentialChanges" USING btree (hash);


--
-- Name: credentialsWithdrawalRequests_credentialsUuid_key; Type: INDEX; Schema: public; Owner: qualkey
--

CREATE UNIQUE INDEX "credentialsWithdrawalRequests_credentialsUuid_key" ON public."credentialsWithdrawalRequests" USING btree ("credentialsUuid");


--
-- Name: credentials_did_key; Type: INDEX; Schema: public; Owner: qualkey
--

CREATE UNIQUE INDEX credentials_did_key ON public.credentials USING btree (did);


--
-- Name: institutionStats_institutionUuid_key; Type: INDEX; Schema: public; Owner: qualkey
--

CREATE UNIQUE INDEX "institutionStats_institutionUuid_key" ON public."institutionStats" USING btree ("institutionUuid");


--
-- Name: institutions_emailDomain_key; Type: INDEX; Schema: public; Owner: qualkey
--

CREATE UNIQUE INDEX "institutions_emailDomain_key" ON public.institutions USING btree ("emailDomain");


--
-- Name: payments_externalId_key; Type: INDEX; Schema: public; Owner: qualkey
--

CREATE UNIQUE INDEX "payments_externalId_key" ON public.payments USING btree ("externalId");


--
-- Name: smartContracts_id_key; Type: INDEX; Schema: public; Owner: qualkey
--

CREATE UNIQUE INDEX "smartContracts_id_key" ON public."smartContracts" USING btree (id);


--
-- Name: systemSettings_name_key; Type: INDEX; Schema: public; Owner: qualkey
--

CREATE UNIQUE INDEX "systemSettings_name_key" ON public."systemSettings" USING btree (name);


--
-- Name: transactions_transactionHash_key; Type: INDEX; Schema: public; Owner: qualkey
--

CREATE UNIQUE INDEX "transactions_transactionHash_key" ON public.transactions USING btree ("transactionHash");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: qualkey
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_stripeCustomerId_key; Type: INDEX; Schema: public; Owner: qualkey
--

CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON public.users USING btree ("stripeCustomerId");


--
-- Name: credentialChanges credentialChanges_credentialUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public."credentialChanges"
    ADD CONSTRAINT "credentialChanges_credentialUuid_fkey" FOREIGN KEY ("credentialUuid") REFERENCES public.credentials(uuid) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: credentials credentials_institutionUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT "credentials_institutionUuid_fkey" FOREIGN KEY ("institutionUuid") REFERENCES public.institutions(uuid) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: credentials credentials_studentUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT "credentials_studentUuid_fkey" FOREIGN KEY ("studentUuid") REFERENCES public.users(uuid) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: credentials credentials_uploadUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT "credentials_uploadUuid_fkey" FOREIGN KEY ("uploadUuid") REFERENCES public.uploads(uuid) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payments payments_studentUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_studentUuid_fkey" FOREIGN KEY ("studentUuid") REFERENCES public.users(uuid) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transactions transactions_smartContractId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "transactions_smartContractId_fkey" FOREIGN KEY ("smartContractId") REFERENCES public."smartContracts"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_institutionUuid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: qualkey
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_institutionUuid_fkey" FOREIGN KEY ("institutionUuid") REFERENCES public.institutions(uuid) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               