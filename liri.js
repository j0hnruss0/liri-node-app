require("dotenv").config();

var moment = require("moment");
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require("fs");

var nodeArgs = process.argv;

var spotify = new Spotify(keys.spotify);

var concertThis = function() {

  var BandsInTownURL = "https://rest.bandsintown.com/artists/" + searchParam + "/events?app_id=codingbootcamp";
  
  axios.get(BandsInTownURL).then(
    function(response) {
      for (var i = 0; i < 10; i++) {
        console.log("Band(s) playing: " + response.data[i].lineup.join(", "));
        console.log("Concert location: " + response.data[i].venue.name);
        console.log(response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
        console.log(moment(response.data[i].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a"));
        console.log("---------------------------");
      }
      
    })
    .catch(function(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

var movieThis = function() {

  var OmdbURL = "https://www.omdbapi.com/?t=" + searchParam + "&apikey=trilogy";

  axios.get(OmdbURL).then(
    function(movieResponse) {
      console.log(movieResponse.data.Title);
      console.log(movieResponse.data.Year);
      console.log("IMDb Rating: " + movieResponse.data.Ratings[0].Value);
      console.log("Rotten Tomatoes Rating: " + movieResponse.data.Ratings[1].Value);
      console.log("Produced in " + movieResponse.data.Country);
      console.log(movieResponse.data.Language);
      console.log(movieResponse.data.Plot);
      console.log(movieResponse.data.Actors);
      console.log("---------------------------------------");
      
    })
    .catch(function(error) {
      if (error.response) {
        
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        
        console.log(error.request);
      } else {
        
        console.log("Error", error.message);
      }
      console.log(error.config);
    });

}

var spotifyThisSong = function() {
  spotify
  .search({ type: 'track', query: searchParam })
  .then(function(response) {
    for (var i = 10; i > 0; i--) {
      console.log("Song: " + response.tracks.items[i].name);
      console.log("Performed by: " + response.tracks.items[i].artists[0].name);
      console.log("Album: " + response.tracks.items[i].album.name);
      console.log("Spotify Page for this Artist: " + response.tracks.items[i].artists[0].external_urls.spotify)
      console.log("Preview: " + response.tracks.items[i].preview_url);
      console.log("---------------------------------------");
    }
  })
  .catch(function(err) {
    console.log(err);
  });
}

//-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
//FUNCTION CALLS HERE

if (nodeArgs[2] === "concert-this") {
  if (nodeArgs.length >= 3) {
    var searchParam = nodeArgs[3];
    concertThis(searchParam);
  }
} else if (nodeArgs[2] === "movie-this") {
  var searchParam = nodeArgs[3];
  if (nodeArgs[3] !== undefined) {
    movieThis(searchParam);
  } else {
    searchParam = "Mr nobody";
    movieThis(searchParam);
  }
} else if (nodeArgs[2] === "spotify-this-song") {
  var searchParam = nodeArgs[3];
  if (nodeArgs[3] !== undefined) {
    spotifyThisSong(searchParam);
  } else {
    spotify
    .request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
    .then(function(data) {
      //console.log(data);
      console.log("Song: " + data.name);
      console.log("Performed by: " + data.artists[0].name);
      console.log("Album: " + data.album.name);
      console.log("Spotify Page for this Artist: " + data.artists[0].external_urls.spotify)
      console.log("Preview: " + data.preview_url);
      console.log("---------------------------------------"); 
    })
    .catch(function(err) {
      console.error('Error occurred: ' + err); 
    });
  }
} else if (nodeArgs[2] === "do-what-it-says") {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    data = data.replace(/"/g,"");
    data = data.split(",");

    searchParam = data[1];
    
    if (data[0] === "spotify-this-song") {
      spotifyThisSong(searchParam);
    } else if (data[0] === "movie-this") {
      movieThis(searchParam);
    } else if (data[0] === "concert-this") {
      concertThis(searchParam);
    }

  });

};