#!/bin/bash
streamURLS=$(curl -s http://auth_server:8000/getstreamurls?name=$1)
sleep 15s
if [ -n "$streamURLS" ]; then
      echo "User $1's stream will be pushed to $streamURLS"
      #split string into array of single URLs, iterate array and push via FFmpeg
      singleURLS=(${streamURLS// / })
      for url in "${singleURLS[@]}"
      do
	  ffmpeg -nostdin -rtmp_live live  -i "rtmp://rtmp_server:1935/live/${1}"  -vcodec copy -acodec copy  -f flv "${url}" &
      done
fi
