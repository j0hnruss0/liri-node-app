# liri-node-app
#### Week 10: LIRI Search Bot

An easy to use CLI search tool for finding your favorite songs on Spotify, looking for upcoming concerts for bands that play your favorite songs, or even learning more about movies that you have/want to see! Written in Node.js

Node Packages used: Node Spotify API, Axios, Dotenv, Moment

In the command prompt, type in "node liri.js" then one of the following commands:
* "spotify-this-song 'song name'": Search for the top ten tracks off the Spotify API that match that name
* "concert-this 'band name'": Find the most recent concerts around the world headlining your favorite bands
* "movie-this 'movie name'": Get some trivia about movies you want to learn more about. Not too wordy!
* "do-what-it-says": make a command with a search term as dictated by the random.txt file. If you change what random.txt says, the output changes, too!. Just be sure to keep that file in the right format (no spaces, command followed by comma followed by search term in double quotes(""))
* *Helpful Reminder*: Put your search queries in quotes, especially if your movie/band/song name is more than one word!

### Look for upcoming concerts with "concert-this" command
[Demo1](LIRI-Bot_Demo.gif)

### Seek out movies with the command "movie-this"
[Demo2](LIRI-bot-demo-2.gif)

### Find songs with "spotify-this-song"
[Demo3](LIRI-bot-demo-3.gif)