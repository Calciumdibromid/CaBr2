FROM codeberg.org/calciumdibromid/cabr2_ci AS builder

# runner has uid 1001
COPY --chown=1001:1001 ./ /source

RUN cd /source/frontend && yarn install --pure-lockfile && yarn build:web


FROM nginx:alpine-slim

COPY --from=builder /source/frontend/dist/CaBr2 /usr/share/nginx/html
COPY ./dockerfiles/app/default.conf /etc/nginx/conf.d
