CREATE TABLE public.file (
    id text NOT NULL,
    filename text,
    originalName text,
    encoding text,
    mimetype text,
    size text,
    url text,
    created timestamp not null default now(),
    modified timestamp not null default now()
);

ALTER TABLE ONLY public.file
    ADD CONSTRAINT file_pkey PRIMARY KEY (id);