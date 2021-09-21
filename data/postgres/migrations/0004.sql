CREATE TABLE public.userextra (
    id text NOT NULL,
    interests text,
    created timestamp not null default now(),
    modified timestamp not null default now()
);

ALTER TABLE ONLY public.userextra
    ADD CONSTRAINT userextra_pkey PRIMARY KEY (id);

alter table public.user add column roles string default '["guest"]'

alter table button add column owner text not null default '';
alter table network add column friendnetworks text not null default '';
alter table network add column owner text not null default '';

alter table network drop column role;