require('dotenv').config();
var axios = require('axios'); //Axios api
var keys = require('./keys.js'); //links to js file to export spotify keys
var fs = require('fs'); //used for reading text files

var action = process.argv[2];
var input = process.argv[3];

var Spotify = require('node-spotify-api'); //spotify api call

var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});
var moment = require('moment'); //Got thsi from Momentjs.com/docs/ page for moment
moment().format();

if (action === 'movie-this') {
  movieThis();
} else if (action === 'concert-this') {
  concertThis();
} else if (action === 'spotify-this-song') {
  spotifyThis();
} else if (action === 'do-what-it-says') {
  doThis();
}

//Function for finding next concert of artist
function concertThis() {
  console.log(input);

  axios
    .get(
      'https://rest.bandsintown.com/artists/' +
        input +
        '/events?app_id=codingbootcamp'
    )
    .then(function(response) {
      var datetime = response.data[0].datetime; //Saves datetime response into a variable
      var dateArr = datetime.split('T'); //Attempting to split the date and time in the response
      //   console.log(dateArr);
      console.log('Venue name: ' + response.data[0].venue.name);
      console.log('Venue location: ' + response.data[0].venue.city);
      console.log('Date of Event: ' + moment(dateArr[0]).format('MM-DD-YYYY'));
    })
    .catch(function(error) {
      console.log(error);
    });
}

//Function for OMDB to get movie information
function movieThis() {
  if (input === undefined) {
    console.log(
      'If you haven\'t watched "Mr. Nobody," then \nyou should: [http://www.imdb.com/title/tt0485947/](http://www.imdb.com/title/tt0485947/)'
    );
    console.log("It's on Netflix!");
  } else {
    var queryUrl =
      'http://www.omdbapi.com/?t=' + input + '&y=&plot=short&apikey=trilogy';

    axios.get(queryUrl).then(function(response) {
      console.log('* Title of the movie: ' + response.data.Title);
      console.log('* Year the movie came out: ' + response.data.Year);
      console.log('* IMDB Rating of the movie: ' + response.data.Country);
      console.log(
        '* Rotten Tomatoes Rating of the movie: ' + response.data.Language
      );
      console.log(
        '* Country where the movie was produced: ' +
          response.data.Ratings[0].Value
      );
      console.log('* Language of the movie: ' + response.data.Ratings[1].Value);
      console.log('* Plot of the movie: ' + response.data.Plot);
      console.log('* Actors in the movie: ' + response.data.Actors);
    });
  }
}

//Function to get song/artist info from spotify
function spotifyThis() {
  if (input === undefined || null) {
    input = 'The Sign';
  }
  spotify
    .search({ type: 'track', query: input })
    .then(function(response) {
      for (var i = 0; i < 5; i++) {
        console.log('------------------------------------------');
        console.log('Artists: ' + response.tracks.items[i].artists[0].name);
        console.log('Song Name: ' + response.tracks.items[i].name);
        console.log('Album Name: ' + response.tracks.items[i].album.name);
        console.log('Preview Link: ' + response.tracks.items[i].preview_url);
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}
// This function will not put the text into the spotifyThis function. It does call it but does not produce the
//   correct output.
function doThis() {
  fs.readFile('random.txt', 'utf8', function(error, data) {
    console.log(data);
    var dataArr = data.split(',');
    if (dataArr.length === 2) {
      console.log(dataArr);
      if (dataArr[0] === 'spotify-this-song') {
        spotifyThis(dataArr[1]);
      } else if (dataArr[0] === 'movie-this') {
        movieThis(dataArr[1]);
      } else if (dataArr[0] === 'concert-this') {
        concertThis(dataArr[1]);
      }
    }
  });
}
