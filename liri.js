require("dotenv").config();


const request = require('request');
const Spotify = require('node-spotify-api');
const keys = require('./keys.js');
const fs = require('fs');

var spotify = new Spotify(keys.spotify);

determineSearch(process.argv.slice(2));

function determineSearch(input) {
    var searchType = input[0].toLowerCase();
    var commands = input.slice(1).join(' ');
    switch (searchType) {
        case "concert-this":
            getConcert(commands);
            break;
        case "spotify-this-song":
            getSong(commands);
            break;
        case "movie-this":
            getMovie(commands);
            break;
        case "do-what-it-says":
            parseFile();
            break;
    }
}

function getConcert(commands) {
    request('https://rest.bandsintown.com/artists/' + commands + '/events?app_id=codingbootcamp', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var parsedBody = JSON.parse(body);
            parsedBody.forEach(function (element) {
                console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
                console.log("Venue: " + element.venue.name);
                console.log("Venue Location: " + element.venue.city);
                console.log("Event Date: " + element.datetime);
                console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
            }, this);
        }
    });
}

function getSong(commands) {
    if (!commands) {
        commands = 'the sign'
    }
    spotify.search({ type: 'track', query: commands, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Preview link: " + data.tracks.items[0].preview_url);
        console.log("album: " + data.tracks.items[0].album.name);
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
    });
}

function getMovie(commands) {
    request("http://www.omdbapi.com/?t=" + commands + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
            var parsedBody = JSON.parse(body);
            console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
            console.log("Title: " + parsedBody.Title);
            console.log("Year: " + parsedBody.Year);
            console.log("IMDB Rating: " + parsedBody.imdbRating);
            console.log("Rotten Tomatoes Rating: " + parsedBody.Ratings[1].Value);
            console.log("Country: " + parsedBody.Country);
            console.log("Language: " + parsedBody.Language);
            console.log("Plot: " + parsedBody.Plot);
            console.log("Actors: " + parsedBody.Actors);
            console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        }
    });
}

function parseFile() {
    fs.readFile("./random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        determineSearch(data.split(' '));
    });
}