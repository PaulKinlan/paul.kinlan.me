FROM alpine:3.5
RUN apk add --no-cache curl bash go nodejs

WORKDIR /home/deploy
COPY . .

RUN npm install
RUN install-hugo.sh
RUN cp -r node_modules/comlink static/javascripts/
RUN ./hugo

# This script outputs to /public
