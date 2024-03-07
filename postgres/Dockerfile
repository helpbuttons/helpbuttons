FROM postgis/postgis:13-3.3-alpine as builder

RUN apk add git cmake make clang build-base llvm-static llvm-dev clang-static clang-dev
RUN git clone https://github.com/zachasme/h3-pg.git
RUN cd h3-pg && cmake -B build -DCMAKE_BUILD_TYPE=Release && cmake --build build && cmake --install build --component h3-pg

FROM postgis/postgis:13-3.3-alpine as runner

COPY --from=builder /usr/local/lib/postgresql/ /usr/local/lib/postgresql/
COPY --from=builder /usr/local/share/postgresql/ /usr/local/share/
COPY --from=builder /usr/local/share/postgresql/extension/ /usr/local/share/postgresql/extension/