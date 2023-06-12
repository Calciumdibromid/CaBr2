FROM codeberg.org/calciumdibromid/cabr2_ci AS builder

# runner hast uid 1001
COPY --chown=1001:1001 ./ /source

RUN cd /source/webserver && cargo build --release --features portable


# https://blog.logrocket.com/packaging-a-rust-web-service-using-docker/
FROM ubuntu:jammy

ARG APP=/opt/cabr2

# install wkhtmltopdf lib + headers
RUN apt-get update \
    && apt-get install -y curl \
    && curl -L -o /tmp/wkhtmltox_amd64.deb https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-2/wkhtmltox_0.12.6.1-2.jammy_amd64.deb \
    && apt-get install -y /tmp/wkhtmltox_amd64.deb \
    && rm /tmp/wkhtmltox_amd64.deb \
    # && apt-get purge -y curl \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 3030

ENV TZ=Etc/UTC \
    APP_USER=cabr2 \
    CABR2_ADDRESS=0.0.0.0:3030

RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER \
    && mkdir -p ${APP} \
    && mkdir -p /tmp/cabr2_server/

COPY --from=builder /source/webserver/target/release/webserver ${APP}/cabr2
COPY ./assets ${APP}/

RUN chown -R $APP_USER:$APP_USER ${APP} \
    && chown -R $APP_USER:$APP_USER /tmp/cabr2_server/

USER $APP_USER
WORKDIR ${APP}

VOLUME /tmp/cabr2_server

CMD ["./cabr2"]
