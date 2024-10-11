#!/bin/bash
streamURLS=$(curl -s http://auth_server:8000/getstreamurls?name=$1)
#split string into array of single URLs, iterate array and the corresponding FFmpeg process
singleURLS=(${streamURLS// / })
if [ -n "$streamURLS" ]; then
        for url in "${singleURLS[@]}"
        do
		pid=`ps axf | grep ${url} | awk 'NR==2 {printf $1}'`
                echo "Stream ${url} with pid ${pid} will be stopped."
                kill -9 $pid
                #kill -15 $pid //Does not work, no idea how to graceful stop ffmpeg :(
        done
fi
