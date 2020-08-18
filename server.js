// ===== packages ===== //

const express = require('express');
require ('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');
const { response, json } = require('express');

// ===== global variables ===== //

const PORT = process.env.PORT || 3003;
const locationApiKey = process.env.GEOCODE_API_KEY;
const weatherApiKey = process.env.WEATHER_API_KEY;
const trailsApiKey = process.env.TRAIL_API_KEY;
const app = express();
app.use(cors());

// ===== routes ===== //


function sendLocation (request,response){
  const userSearch = request.query.city;
  const urlSearch = `https://us1.locationiq.com/v1/search.php?key=${locationApiKey}&q=${userSearch}&format=json`;

  superagent.get(urlSearch)
    .then(locationIq => {
      const locationArray = locationIq.body;
      const constructedLocation = new Location(userSearch,locationArray);
      response.send(constructedLocation);
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

app.get('/location', sendLocation);
app.get('/weather', sendWeather);
app.get('/trails', sendTrail);

// ===== constructor function ===== //

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

// ===== start the server ===== //

app.listen(PORT, () => console.log(`we are running on PORT : ${PORT}`));
