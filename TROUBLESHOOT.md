DATABASE
dump: $ docker-compose exec pg_dump -U postgres database_name > /desired/path/on/your/machine/dump.sql
restore: $  docker exec -i bbff9ffdbe81 psql -U postgres hb-db < dump.sql 