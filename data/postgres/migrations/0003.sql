ALTER TABLE button ADD COLUMN created timestamp not null default now();
ALTER TABLE button ADD COLUMN modified timestamp not null default now();

ALTER TABLE buttonsnetwork ADD COLUMN created timestamp not null default now();
ALTER TABLE buttonsnetwork ADD COLUMN modified timestamp not null default now();

ALTER TABLE network ADD COLUMN created timestamp not null default now();
ALTER TABLE network ADD COLUMN modified timestamp not null default now();

ALTER TABLE role ADD COLUMN created timestamp not null default now();
ALTER TABLE role ADD COLUMN modified timestamp not null default now();

ALTER TABLE tag ADD COLUMN created timestamp not null default now();
ALTER TABLE tag ADD COLUMN modified timestamp not null default now();

ALTER TABLE templatebuttonnetwork ADD COLUMN created timestamp not null default now();
ALTER TABLE templatebuttonnetwork ADD COLUMN modified timestamp not null default now();

ALTER TABLE templatebutton ADD COLUMN created timestamp not null default now();
ALTER TABLE templatebutton ADD COLUMN modified timestamp not null default now();