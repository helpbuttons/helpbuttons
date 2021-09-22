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
-- Name: button; Type: TABLE; Schema: public
--

CREATE TABLE public.button (
    id integer NOT NULL,
    name text,
    type text NOT NULL,
    tags text,
    description text,
    geoplace text NOT NULL,
    templatebuttonid integer
);




--
-- Name: button_id_seq; Type: SEQUENCE; Schema: public
--

CREATE SEQUENCE public.button_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- Name: button_id_seq; Type: SEQUENCE OWNED BY; Schema: public
--

ALTER SEQUENCE public.button_id_seq OWNED BY public.button.id;


--
-- Name: buttonsnetwork; Type: TABLE; Schema: public
--

CREATE TABLE public.buttonsnetwork (
    id integer NOT NULL,
    networkid integer,
    buttonid integer
);


--
-- Name: buttonsnetwork_id_seq; Type: SEQUENCE; Schema: public
--

CREATE SEQUENCE public.buttonsnetwork_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- Name: buttonsnetwork_id_seq; Type: SEQUENCE OWNED BY; Schema: public
--

ALTER SEQUENCE public.buttonsnetwork_id_seq OWNED BY public.buttonsnetwork.id;


--
-- Name: network; Type: TABLE; Schema: public
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
    role text DEFAULT 'admin'::text
);


--
-- Name: network_id_seq; Type: SEQUENCE; Schema: public
--

CREATE SEQUENCE public.network_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- Name: network_id_seq; Type: SEQUENCE OWNED BY; Schema: public
--

ALTER SEQUENCE public.network_id_seq OWNED BY public.network.id;


--
-- Name: role; Type: TABLE; Schema: public
--

CREATE TABLE public.role (
    id integer NOT NULL,
    name text NOT NULL,
    description text
);




--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- Name: templatebutton; Type: TABLE; Schema: public
--

CREATE TABLE public.templatebutton (
    id integer NOT NULL,
    name text,
    type text NOT NULL,
    fields text NOT NULL
);




--
-- Name: templatebutton_id_seq; Type: SEQUENCE; Schema: public
--

CREATE SEQUENCE public.templatebutton_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- Name: templatebutton_id_seq; Type: SEQUENCE OWNED BY; Schema: public
--

ALTER SEQUENCE public.templatebutton_id_seq OWNED BY public.templatebutton.id;


--
-- Name: templatebuttonnetwork; Type: TABLE; Schema: public
--

CREATE TABLE public.templatebuttonnetwork (
    id integer NOT NULL,
    networkid integer,
    templatebuttonid integer
);




--
-- Name: templatebuttonnetwork_id_seq; Type: SEQUENCE; Schema: public
--

CREATE SEQUENCE public.templatebuttonnetwork_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- Name: templatebuttonnetwork_id_seq; Type: SEQUENCE OWNED BY; Schema: public
--

ALTER SEQUENCE public.templatebuttonnetwork_id_seq OWNED BY public.templatebuttonnetwork.id;


--
-- Name: button id; Type: DEFAULT; Schema: public
--

ALTER TABLE ONLY public.button ALTER COLUMN id SET DEFAULT nextval('public.button_id_seq'::regclass);


--
-- Name: buttonsnetwork id; Type: DEFAULT; Schema: public
--

ALTER TABLE ONLY public.buttonsnetwork ALTER COLUMN id SET DEFAULT nextval('public.buttonsnetwork_id_seq'::regclass);


--
-- Name: network id; Type: DEFAULT; Schema: public
--

ALTER TABLE ONLY public.network ALTER COLUMN id SET DEFAULT nextval('public.network_id_seq'::regclass);


--
-- Name: role id; Type: DEFAULT; Schema: public
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- Name: templatebutton id; Type: DEFAULT; Schema: public
--

ALTER TABLE ONLY public.templatebutton ALTER COLUMN id SET DEFAULT nextval('public.templatebutton_id_seq'::regclass);


--
-- Name: templatebuttonnetwork id; Type: DEFAULT; Schema: public
--

ALTER TABLE ONLY public.templatebuttonnetwork ALTER COLUMN id SET DEFAULT nextval('public.templatebuttonnetwork_id_seq'::regclass);


--
-- Data for Name: button; Type: TABLE DATA; Schema: public
--

COPY public.button (id, name, type, tags, description, geoplace, templatebuttonid) FROM stdin;
\.


--
-- Data for Name: buttonsnetwork; Type: TABLE DATA; Schema: public
--

COPY public.buttonsnetwork (id, networkid, buttonid) FROM stdin;
\.


--
-- Data for Name: network; Type: TABLE DATA; Schema: public
--

COPY public.network (name, id, url, avatar, description, privacy, place, geoplace, radius, tags, role) FROM stdin;
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public
--

COPY public.role (id, name, description) FROM stdin;
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: templatebutton; Type: TABLE DATA; Schema: public
--

COPY public.templatebutton (id, name, type, fields) FROM stdin;
\.


--
-- Data for Name: templatebuttonnetwork; Type: TABLE DATA; Schema: public
--

COPY public.templatebuttonnetwork (id, networkid, templatebuttonid) FROM stdin;
\.


--
-- Name: button_id_seq; Type: SEQUENCE SET; Schema: public
--

SELECT pg_catalog.setval('public.button_id_seq', 1, false);


--
-- Name: buttonsnetwork_id_seq; Type: SEQUENCE SET; Schema: public
--

SELECT pg_catalog.setval('public.buttonsnetwork_id_seq', 1, false);


--
-- Name: network_id_seq; Type: SEQUENCE SET; Schema: public
--

SELECT pg_catalog.setval('public.network_id_seq', 1, false);


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public
--

SELECT pg_catalog.setval('public.role_id_seq', 1, false);


--
-- Name: templatebutton_id_seq; Type: SEQUENCE SET; Schema: public
--

SELECT pg_catalog.setval('public.templatebutton_id_seq', 1, false);


--
-- Name: templatebuttonnetwork_id_seq; Type: SEQUENCE SET; Schema: public
--

SELECT pg_catalog.setval('public.templatebuttonnetwork_id_seq', 1, false);


--
-- Name: button button_pkey; Type: CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public.button
    ADD CONSTRAINT button_pkey PRIMARY KEY (id);


--
-- Name: buttonsnetwork buttonsnetwork_pkey; Type: CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public.buttonsnetwork
    ADD CONSTRAINT buttonsnetwork_pkey PRIMARY KEY (networkid,buttonid);


--
-- Name: network network_pkey; Type: CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public.network
    ADD CONSTRAINT network_pkey PRIMARY KEY (id);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: templatebutton templatebutton_pkey; Type: CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public.templatebutton
    ADD CONSTRAINT templatebutton_pkey PRIMARY KEY (id);


--
-- Name: templatebuttonnetwork templatebuttonnetwork_pkey; Type: CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public.templatebuttonnetwork
    ADD CONSTRAINT templatebuttonnetwork_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

