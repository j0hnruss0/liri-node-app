require("dotenv").config();

var moment = require("moment");
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require("fs");

//NOTICE: package.json may show 'inquirer' as a dependency but it is not being used
// in the current version of this app. There are no additional imputs besides
// 'concert-this', 'movie-this', and 'spotify-this-song', followed by a search term or name

var nodeArgs = process.argv;

var spotify = new Spotify(keys.spotify);

// This function searches for concerts throught the Bands in Town API according
// to the band name entered after 'concert-this' in the terminal. The ten most
// recent show times (coverted to a readavle format with moment.js) are displayed
// as well as appended to the log.txt file
var concertThis = function() {

  var BandsInTownURL = "https://rest.bandsintown.com/artists/" + searchParam + "/events?app_id=codingbootcamp";
  
  axios.get(BandsInTownURL).then(
    function(response) {
      for (var i = 0; i < 10; i++) {
        var concertItem = "Band(s) playing: " + response.data[i].lineup.join(", ") + "\nConcert location: " + response.data[i].venue.name
        + "\n" + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country
        + "\n" + moment(response.data[i].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a") + "\n------------------------------\n";
        
        console.log(concertItem);
        
        fs.appendFile("log.txt", concertItem, function(err) {
          if (err) {
            return console.log(err);
          }
        });
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

// The movieThis function allows the user to type 'movie-this' in the CL, followed
// by a movie title, to show information related to that movie in the terminal and
// then append all that info to the log.txt file
var movieThis = function() {

  var OmdbURL = "https://www.omdbapi.com/?t=" + searchParam + "&apikey=trilogy";

  axios.get(OmdbURL).then(
    function(movieResponse) {
      var movieItem = movieResponse.data.Title + "\n" + movieResponse.data.Year
      + "\nIMDb Rating: " + movieResponse.data.Ratings[0].Value + "\nRotten Tomatoes Rating: " + movieResponse.data.Ratings[1].Value
      + "\nProduced in " + movieResponse.data.Country + "\n" + movieResponse.data.Language
      + "\n" + movieResponse.data.Plot + "\n" + movieResponse.data.Actors + "\n---------------------------------------\n"
      
      console.log(movieItem);
      
      fs.appendFile("log.txt", movieItem, function(err) {
        if (err) {
          return console.log(err);
        }
      });
      
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

//This function gets the top 5 songs from Node Spotify API, shows them in the console then
//appends the list to the log.txt file
var spotifyThisSong = function() {
  spotify
  .search({ type: 'track', query: searchParam })
  .then(function(response) {
      for (var i = 0; i < 5; i++) {
        if (JSON.stringify(response.tracks.items[i].name).toLowerCase().includes(searchParam)) {
          var item = "Song: " + response.tracks.items[i].name + "\nPerformed by: " + response.tracks.items[i].artists[0].name 
            + "\nAlbum: " + response.tracks.items[i].album.name + "\nSpotify Page for this Artist: " + response.tracks.items[i].artists[0].external_urls.spotify
            + "\nPreview: " + response.tracks.items[i].preview_url + "\n---------------------------------------" + "\n";

          console.log(item);
          
          fs.appendFile("log.txt", item, function(err) {
            if (err) {
              return console.log(err);
            }
          });
          
        }
      }

  })
  .catch(function(err) {
    console.log(err);
  });
}

// var addLog = function(command, query) {
//   var item = "[" + command + ", " + query + "]\n";
//   fs.appendFile("log.txt", item, function(err) {
//     if (err) {
//       return console.log(err);
//     }
//   });
// }

//-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
//FUNCTION CALLS HERE

if (nodeArgs[2] === "concert-this") {
  if (nodeArgs.length >= 3) {
    var searchParam = nodeArgs.slice(3).join(" ");
    concertThis(searchParam);
  }
} else if (nodeArgs[2] === "movie-this") {
  var searchParam = nodeArgs.slice(3).join(" ");
  if (nodeArgs[3] !== undefined) {
    movieThis(searchParam);
  } else {
    searchParam = "Mr nobody";
    movieThis(searchParam);
  }
} else if (nodeArgs[2] === "spotify-this-song") {
  var searchParam = nodeArgs.slice(3).join(" ");
  if (nodeArgs[3] !== undefined) {
    spotifyThisSong(searchParam);
  } else {
    spotify
    .request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
    .then(function(data) {
      
      var aobItem = "Song: " + data.name + "\nPerformed by: " + data.artists[0].name 
            + "\nAlbum: " + data.artists[0].name + "\nSpotify Page for this Artist: " + data.artists[0].external_urls.spotify
            + "\nPreview: " + data.preview_url + "\n---------------------------------------" + "\n";

      console.log(aobItem);
          
      fs.appendFile("log.txt", aobItem, function(err) {
        if (err) {
          return console.log(err);
        }
      });
      
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