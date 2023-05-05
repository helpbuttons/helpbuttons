FROM postgis/postgis:13-3.3-alpine

RUN apk add git cmake make clang build-base llvm-static llvm-dev clang-static clang-dev
# RUN git clone https://github.com/zachasme/h3-pg.git
# RUN cd h3-pg && cmake -B build -DCMAKE_BUILD_TYPE=Release && cmake --build build && cmake --install build --component h3-pg

RUN apk add --no-cache python3 py3-pip
RUN pip3 install pgxnclient

RUN pgxn install h3
RUN pgxn install h3_postgis

# COPY ./initdb-postgis.sh /docker-entrypoint-initdb.d/10_postgis.sh
# RUN pgxn load h3 


COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]