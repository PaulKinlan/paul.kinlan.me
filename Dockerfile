FROM alpine:3.5
RUN apk add --no-cache curl wget bash go nodejs

WORKDIR /home/deploy
COPY . .

RUN npm install
RUN bash ./install-hugo.sh
RUN cp -r ./node_modules/comlink ./static/javascripts/
RUN ./hugo

# This script outputs to /public
RUN mv ./public /public