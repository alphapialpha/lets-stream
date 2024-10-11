# lets-stream
Easy to setup dockerized Nginx / RTMP server with multi-user authentication as an ingest for RTMP streams. 
The system furthermore provides outgoing RTMP streams for any incoming stream also protected by (optional) authentication for easy integration into your OBS, to play back in VLC, etc.
It can also automatically push any incoming stream to multiple external services at once like Twitch, YT, etc.

## Prerequisites
- docker & docker compose
- git client

## Setup
1. clone this repository: ```git clone https://github.com/AlphaPiAlpha/lets-stream.git```
2. enter the lets-stream folder: ```cd lets-stream```
3. copy the auth/auth.json.example to auth/auth.json: ```cp auth/auth.json.example auth/auth.json```
5. edit the auth.json (see "auth.json explained" section below)
6. build it: ```docker compose build```
7. run it: ```docker compose up -d```

##  "auth.json" explained
The example auth.json file looks like this and it consists of three main sections: 
- _**publish**_ for incoming streams pushed to the server
- _**play**_ for outgoing streams to play back somewhere else
- _**stream**_ for streams to be pushed to third party services, e.g. Twitch.

For the ```publish``` and ```play``` section the *__name__* value always represents the name of the stream protected by the *__key__* value.
For the ```publish``` section the *__name__* value represents the name of the stream while *__url__* contains the url the stream will be automatically pushed to.

>[!IMPORTANT]
All entries for name, key and url are case sensitive

The example file provides all the configuration data for *__two streams__* (or users) named *__Paul__* and *__Anna__*.

```yaml
{   
    "publish": [
         {  
            "name": "Paul",
            "key": "SuperSecretKey"
         },
         {
            "name": "Anna",
            "key": "AnotherSecretKey"
    ],
    "play": [
        {   
            "name": "Paul",
            "key" : "PlayBackKey"
        },
        {   
            "name": "Anna",
            "key" : ""
        }
    ],
    "stream": [
        {   
            "name": "Paul",
            "url" : "rtmp://live.twitch.tv/app/live_FOOBAR_TEST"
        },
        {   
            "name": "Paul",
            "url" : "https://a.upload.youtube.com/FOOBAR_TEST"
        }
    ]
}
```

### User/Stream Paul
Paul is configured as follows:
- Paul can stream to the server via RTMP from any app like OBS with the following settings:
  - Server: ```rtmp://SERVER_IP/live```
  - Stream Key: ```Paul?key=SuperSecretKey```
- Paul's stream can be received by any app like OBS or VLC via the following url: ```rtmp://SERVER_IP/live/Paul?key=PlayBackKey```
- Paul's stream will be automatically pushed to the two urls ```rtmp://live.twitch.tv/app/live_FOOBAR_TEST``` and ```https://a.upload.youtube.com/FOOBAR_TEST``` when Paul starts pushing a stream to the server

### User/Stream Anna
- Anna can stream to the server via RTMP from any app like OBS with the following settings:
  - Server: ```rtmp://SERVER_IP/live```
  - Stream Key: ```Anna?key=AnotherSecretKey```
- Anna's stream is NOT protected by a key and can be received by any app like OBS or VLC via the following url: ```rtmp://SERVER_IP/live/Anna```
- Anna does not have any entries in the stream section, so her stream to the server will not be automatically pushed somewhere else

>[!IMPORTANT]
>Pay attention to upper and lower case for names and keys in the urls above, they have to exactly match the entries in your auth.json

## Updating the auth.json
You can edit the ```auth/auth.json``` without a problem while the system is running. When done editing and saved simply run the ```./update.sh``` command so the new auth.json gets copied into the running container. No need for restarts.
