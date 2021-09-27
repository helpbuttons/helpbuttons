--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4 (Debian 13.4-1.pgdg100+1)
-- Dumped by pg_dump version 13.4 (Debian 13.4-1.pgdg100+1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: button; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.button (
    id integer NOT NULL,
    name text,
    type text NOT NULL,
    tags text,
    description text,
    geoplace text NOT NULL,
    templatebuttonid integer,
    created timestamp without time zone DEFAULT now() NOT NULL,
    modified timestamp without time zone DEFAULT now() NOT NULL,
    owner text DEFAULT ''::text NOT NULL
);


ALTER TABLE public.button OWNER TO postgres;

--
-- Name: button_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.button_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.button_id_seq OWNER TO postgres;

--
-- Name: button_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.button_id_seq OWNED BY public.button.id;


--
-- Name: buttonsnetwork; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buttonsnetwork (
    id integer NOT NULL,
    networkid integer,
    buttonid integer,
    created timestamp without time zone DEFAULT now() NOT NULL,
    modified timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.buttonsnetwork OWNER TO postgres;

--
-- Name: buttonsnetwork_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.buttonsnetwork_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.buttonsnetwork_id_seq OWNER TO postgres;

--
-- Name: buttonsnetwork_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.buttonsnetwork_id_seq OWNED BY public.buttonsnetwork.id;


--
-- Name: file; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.file (
    id text NOT NULL,
    filename text,
    originalname text,
    encoding text,
    mimetype text,
    size text,
    url text,
    created timestamp without time zone DEFAULT now() NOT NULL,
    modified timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.file OWNER TO postgres;

--
-- Name: network; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.network (
    name text NOT NULL,
    id integer NOT NULL,
    url text,
    avatar text,
    description text,
    privacy text DEFAULT 'private'::text,
    place text,
    geoplace text NOT NULL,
    radius integer,
    tags text,
    friendnetworks text,
    created timestamp without time zone DEFAULT now() NOT NULL,
    modified timestamp without time zone DEFAULT now() NOT NULL,
    owner text DEFAULT ''::text NOT NULL
);


ALTER TABLE public.network OWNER TO postgres;

--
-- Name: network_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.network_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.network_id_seq OWNER TO postgres;

--
-- Name: network_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.network_id_seq OWNED BY public.network.id;


--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    created timestamp without time zone DEFAULT now() NOT NULL,
    modified timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.role_id_seq OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- Name: tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag (
    id text NOT NULL,
    modelname text NOT NULL,
    modelid text NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    modified timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tag OWNER TO postgres;

--
-- Name: templatebutton; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.templatebutton (
    id integer NOT NULL,
    name text,
    type text NOT NULL,
    fields text NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    modified timestamp without time zone DEFAULT now() NOT NULL,
    owner text DEFAULT ''::text NOT NULL
);


ALTER TABLE public.templatebutton OWNER TO postgres;

--
-- Name: templatebutton_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.templatebutton_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.templatebutton_id_seq OWNER TO postgres;

--
-- Name: templatebutton_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.templatebutton_id_seq OWNED BY public.templatebutton.id;


--
-- Name: templatebuttonnetwork; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.templatebuttonnetwork (
    id integer NOT NULL,
    networkid integer,
    templatebuttonid integer,
    created timestamp without time zone DEFAULT now() NOT NULL,
    modified timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.templatebuttonnetwork OWNER TO postgres;

--
-- Name: templatebuttonnetwork_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.templatebuttonnetwork_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.templatebuttonnetwork_id_seq OWNER TO postgres;

--
-- Name: templatebuttonnetwork_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.templatebuttonnetwork_id_seq OWNED BY public.templatebuttonnetwork.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id text NOT NULL,
    realm text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    description text,
    emailverified boolean default false,
    verificationtoken text,
    roles text DEFAULT '["guest"]'::text
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: usercredentials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usercredentials (
    id text NOT NULL,
    password text NOT NULL,
    userid text NOT NULL,
    description text
);


ALTER TABLE public.usercredentials OWNER TO postgres;

--
-- Name: userextra; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userextra (
    id text NOT NULL,
    interests text,
    created timestamp without time zone DEFAULT now() NOT NULL,
    modified timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.userextra OWNER TO postgres;

--
-- Name: button id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.button ALTER COLUMN id SET DEFAULT nextval('public.button_id_seq'::regclass);


--
-- Name: buttonsnetwork id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buttonsnetwork ALTER COLUMN id SET DEFAULT nextval('public.buttonsnetwork_id_seq'::regclass);


--
-- Name: network id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.network ALTER COLUMN id SET DEFAULT nextval('public.network_id_seq'::regclass);


--
-- Name: role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- Name: templatebutton id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.templatebutton ALTER COLUMN id SET DEFAULT nextval('public.templatebutton_id_seq'::regclass);


--
-- Name: templatebuttonnetwork id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.templatebuttonnetwork ALTER COLUMN id SET DEFAULT nextval('public.templatebuttonnetwork_id_seq'::regclass);


--
-- Name: button_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.button_id_seq', 1, false);


--
-- Name: buttonsnetwork_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.buttonsnetwork_id_seq', 1, false);


--
-- Name: network_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.network_id_seq', 1, false);


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_id_seq', 1, false);


--
-- Name: templatebutton_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.templatebutton_id_seq', 1, false);


--
-- Name: templatebuttonnetwork_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.templatebuttonnetwork_id_seq', 1, false);


--
-- Name: file file_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.file
    ADD CONSTRAINT file_pkey PRIMARY KEY (id);


--
-- Name: tag tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id, modelname, modelid);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: usercredentials usercredentials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usercredentials
    ADD CONSTRAINT usercredentials_pkey PRIMARY KEY (id);


--
-- Name: userextra userextra_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userextra
    ADD CONSTRAINT userextra_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--
