CREATE TABLE public.userextra (
    id text NOT NULL,
    interests text,
    created timestamp not null default now(),
    modified timestamp not null default now()
);

ALTER TABLE ONLY public.userextra
    ADD CONSTRAINT userextra_pkey PRIMARY KEY (id);
