require("dotenv").config();

var moment = require("moment");
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');

var nodeArgs = process.argv;

var searchParam = "";

for (var i = 3; i < nodeArgs.length; i++) {

  if (i > 3 && i < nodeArgs.length) {
    searchParam = searchParam + "+" + nodeArgs[i];
  } else {
    searchParam += nodeArgs[i];
  }
  
};

var spotify = new Spotify(keys.spotify);

var BandsInTownURL = "https://rest.bandsintown.com/artists/" + searchParam + "/events?app_id=codingbootcamp";
var OmdbURL = "https://www.omdbapi.com/?t=" + searchParam + "&apikey=trilogy";

axios.get(BandsInTownURL).then(
    function(response) {
      if (nodeArgs[2] === "concert-this") {
        for (var i = 0; i < 10; i++) {
          console.log(response.data[i].lineup.join(", "));
          console.log(response.data[i].venue.name);
          console.log(response.data[i].venue.city);
          console.log(moment(response.data[i].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a"));
          console.log("---------------------------");
        }
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

axios.get(OmdbURL).then(
  function(movieResponse) {
    if (nodeArgs[2] === "movie-this") {
      console.log(movieResponse.data.Title);
      console.log(movieResponse.data.Year);
      console.log("IMDb Rating: " + movieResponse.data.Ratings[0].Value);
      console.log("Rotten Tomatoes Rating: " + movieResponse.data.Ratings[1].Value);
      console.log("Produced in " + movieResponse.data.Country);
      console.log(movieResponse.data.Language);
      console.log(movieResponse.data.Plot);
      console.log(movieResponse.data.Actors);
      console.log("---------------------------------------");
    } 
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

if (nodeArgs[2] === "spotify-this-song") {
  spotify
  .search({ type: 'track', query: searchParam })
  .then(function(response) {
    for (var i = 0; i < 10; i++) {
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

