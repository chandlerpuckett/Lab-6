'use strict';

// TODO: switch from 16-day to 8 day forecast
// ===== packages ===== //

const express = require('express');
require ('dotenv').config();
const cors = require('cors');

const superagent = require('superagent');
const { response, json } = require('express');
const pg = require('pg');

// ===== global variables ===== //

const PORT = process.env.PORT || 3003;
const locationApiKey = process.env.GEOCODE_API_KEY;
const weatherApiKey = process.env.WEATHER_API_KEY;
const trailsApiKey = process.env.TRAIL_API_KEY;
const movieApiKey = process.env.MOVIE_API_KEY;
const databaseUrl = process.env.DATABASE_URL;
const yelpApiKey = process.env.YELP_API_KEY;
const yelpClientId = process.env.YELP_CLIENT_ID;



const app = express();
app.use(cors());

const client = new pg.Client(databaseUrl);
client.on('error',(error) => console.error(error));

// ===== routes ===== //

function checkSql (request,response) {

  // client.query('SELECT * FROM user_search WHERE search_query = $1');

  const userSearch = request.query.city;
  const queryCheck = 'SELECT * FROM user_search;';

  client.query(queryCheck)

    .then(fromSql => {

      let counter = 0;
      for (let value of fromSql.rows){

        if (value.search_query === userSearch){
          console.log('PULLED FROM SERVER: ', value);
          response.send(value);
          break;

        } else if (counter === fromSql.rows.length - 1){
          sendLocationToApi(request,response);
        }
        counter++;
      }
    })
}


function sendLocationToApi (request,response){

  const userSearch = request.query.city;
  const urlSearch = `https://us1.locationiq.com/v1/search.php?key=${locationApiKey}&q=${userSearch}&format=json`;

  const queryString = 'INSERT INTO user_search (search_query, latitude, longitude,formatted_query) VALUES ($1,$2,$3,$4)';

  superagent.get(urlSearch)

    .then(locationIq => {
      const locationArray = locationIq.body;
      const constructedLocation = new Location(userSearch,locationArray);

      const queryArray =
        [ constructedLocation.search_query,
          constructedLocation.latitude,
          constructedLocation.longitude,
          constructedLocation.formatted_query
        ];

      // pushes to database //
      client.query(queryString,queryArray)
        .then( () => {
          console.log ('PULLED FROM THE API: ',constructedLocation)
          response.send(constructedLocation);
        })
        .catch(error => {
          console.error(error);
          response.status(500).send('the SQL insertion failed');
        })
    })
    .catch(error => {
      console.log(error);
      response.status(500).send(error.message);
    })
}

function sendWeather (request, response){
  let lat = request.query.latitude;
  let lon = request.query.longitude;

  const urlSearch = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lon}&key=${weatherApiKey}`;

  superagent.get(urlSearch)
    .then(weatherData => {
      const weatherPass = weatherData.body.data;
      // TODO: slice array (0,8) to reduce amount of days sent

      response.send(weatherPass.map(construct => new Weather(construct)));
    })
    .catch(error => {
      console.log(error);
      response.status(500).send(error.message);
    })

}

function sendTrail (request,response){
  let lat = request.query.latitude;
  let lon = request.query.longitude;

  const urlSearch = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${trailsApiKey}`;

  superagent.get(urlSearch)
    .then(trailData => {
      const trailPass = trailData.body.trails;
      response.send(trailPass.map(construct => new Trail(construct)));
    })
    .catch(error => {
      console.log(error);
      response.status(500).send(error.message);
    })
}

function getMovies (request,response){
  const city = request.query.search_query;
  console.log('req query: ', city)
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${movieApiKey}&language=en-US&query=${city}&page=1&include_adult=false`;

  superagent.get(url)
    .then(movieData => {
      const movieSend = movieData.body.results;
      response.send(movieSend.map(construct => new Movie(construct)));

    })
    .catch(error => {
      console.log(error);
      response.status(500).send(error.message);
    })

}

function getYelp (request,response){
  let lat = request.query.latitude;
  let lon = request.query.longitude;

  const url = `https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=${lat}&longitude=${lon}&start=${request.query.page*5}`;

  superagent.get(url)

    .set('Authorization', `Bearer ${yelpApiKey}`)

    .then(yelpData => {
      const yelpSend = yelpData.body.businesses;
      response.send(yelpSend.map(construct => new Yelp(construct)));
    })
    .catch(error => {
      console.log(error);
      response.status(500).send(error.message);
    })


}

// app.get('/location', sendLocationToApi);
app.get('/location', checkSql);
app.get('/weather', sendWeather);
app.get('/trails', sendTrail);
app.get('/movies', getMovies);
app.get('/yelp', getYelp);

// ===== constructors / functions ===== //

function Location (userSearch, jsonLocationObject){
  this.search_query = userSearch;
  this.formatted_query = jsonLocationObject[0].display_name;
  this.latitude = jsonLocationObject[0].lat;
  this.longitude = jsonLocationObject[0].lon;
}

function Weather (jsonWeatherObject){
  this.forecast = jsonWeatherObject.weather.description;
  this.time = jsonWeatherObject.valid_date;
}

function Trail (jsonTrailObject){
  this.name = jsonTrailObject.name ;
  this.location = jsonTrailObject.location ;
  this.length = jsonTrailObject.length ;
  this.stars = jsonTrailObject.stars ;
  this.stars_votes = jsonTrailObject.starVotes ;
  this.summary = jsonTrailObject.summary ;
  this.trail_url = jsonTrailObject.url ;
  this.conditions = jsonTrailObject.conditionStatus ;
  this.condition_date = jsonTrailObject.conditionDate ;
  this.condition_time = jsonTrailObject.conditionDate ;
}

function Movie (jsonMovieObject){
  this.title = jsonMovieObject.title;
  this.overview = jsonMovieObject.overview;
  this.average_votes = jsonMovieObject.vote_average;
  this.total_votes = jsonMovieObject.vote_count;
  this.image_url = jsonMovieObject.poster_path;
  this.popularity = jsonMovieObject.popularity;
  this.released_on = jsonMovieObject.release_date;
}

function Yelp (jsonYelpObject){
  this.name = jsonYelpObject.name;
  this.image_url = jsonYelpObject.image_url;
  this.price = jsonYelpObject.price;
  this.rating = jsonYelpObject.rating;
  this.url = jsonYelpObject.url;
}

// ===== start the server ===== //

client.connect()
  .then( () => {
    app.listen(PORT, () => console.log(`we are running on PORT : ${PORT}`));
  })
