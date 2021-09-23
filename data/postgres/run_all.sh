#!/bin/bash
FULLPATH="/docker-entrypoint-initdb.d"

case "$1" in
    "reset")
        psql -U postgres postgres -c "DROP table button,buttonsnetwork,templatebuttonnetwork,network,templatebutton,role,tag CASCADE;"
        psql -U postgres postgres -c "DROP table public.user,usercredentials,userextra CASCADE;"
        ;&
    "new")
        psql -U postgres postgres < {$FULLPATH}/schema.sql
        ;&
esac