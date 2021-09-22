#!/bin/bash
FULLPATH=/migrations/

case "$1" in
    "reset")
        psql -U postgres postgres -c "DROP table button,buttonsnetwork,templatebuttonnetwork,network,templatebutton,role,tag CASCADE;"
        psql -U postgres postgres -c "DROP table public.user,usercredentials,userextra CASCADE;"
        ;&
    "new")
        psql -U postgres postgres < ${FULLPATH}schema.sql
        ;&
    "migrations")
        psql -U postgres postgres < ${FULLPATH}/migrations/0001.sql
        psql -U postgres postgres < ${FULLPATH}/migrations/0002.sql
        psql -U postgres postgres < ${FULLPATH}/migrations/0003.sql
        psql -U postgres postgres < ${FULLPATH}/migrations/0004.sql
        ;;
esac