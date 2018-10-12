FROM alpine:3.5
RUN apk add --no-cache curl wget bash go nodejs

RUN mkdir /home/deploy
WORKDIR /home/deploy
COPY . /home/deploy

RUN npm install
RUN bash ./install-hugo.sh
RUN cp -r ./node_modules/comlink ./static/javascripts/
RUN ls -al 
RUN ./hugo

# This script outputs to /public
RUN mv /home/deploy/public /public