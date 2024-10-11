FROM tiangolo/nginx-rtmp
RUN apt update
RUN apt install -y ffmpeg apache2-utils jq
WORKDIR /usr/local/nginx/html/rtmp
COPY stat.xsl .
WORKDIR /etc/nginx
COPY nginx.conf .
COPY htpasswd ./.htpasswd
WORKDIR /user/local/nginx/html
COPY index.html /usr/local/nginx/html/index.html
WORKDIR /usr/local/bin/lets-stream
COPY *.sh .
RUN mkdir kills
