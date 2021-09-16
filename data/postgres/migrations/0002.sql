CREATE TABLE public.tag (
    id text NOT NULL,
    modelName text NOT NULL,
    modelId text NOT NULL
);

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id,modelName,modelId);