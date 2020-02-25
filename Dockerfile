From necronia/mailserver

MAINTAINER necronia 

ENV HOME /root

ENV maildomain skhappycampus.com

ENV smtp_user admin:password

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY . .

RUN chmod 755 ./start.sh

CMD ./start.sh

