CREATE TABLE public.user (
    id text NOT NULL,
    realm text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    description text,
    emailverified boolean,
    verificationtoken text
);

ALTER TABLE ONLY public.user
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);

CREATE TABLE public.usercredentials (
    id text NOT NULL,
    password text NOT NULL,
    userid text NOT NULL,
    description text
);

ALTER TABLE ONLY public.usercredentials
    ADD CONSTRAINT usercredentials_pkey PRIMARY KEY (id);