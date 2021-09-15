#!/bin/bash
FULLPATH=/migrations/

case "$1" in
    "reset")
        psql -U postgres postgres -c "DROP table button,buttonsnetwork,templatebuttonnetwork,network,templatebutton,role CASCADE;"
        psql -U postgres postgres -c "DROP table public.user,usercredentials CASCADE;"
        ;&
    "new")
        psql -U postgres postgres < ${FULLPATH}schema.sql
        ;&
    "migrations")
        psql -U postgres postgres < ${FULLPATH}/migrations/*.sql;;
esac