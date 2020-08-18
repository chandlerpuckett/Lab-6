// ===== packages ===== //

const express = require('express');
require ('dotenv').config();
const cors = require('cors');
const { response } = require('express');

// ===== global variables ===== //

const PORT = process.env.PORT || 3003;
const app = express();
app.use(cors());

// ===== routes ===== //


function sendLocation (request,response){
  const jsonLocationObject = require('./data/location.json');
  const city = request.query.city;

  // take out ffasdkfmasodk lab 7
  if (city !== 'lynnwood'){
    return response.status(500).send('we only have `Lynnwood`');
  }

  const constructedLocation = new Location(city,jsonLocationObject);
  response.send(constructedLocation);
}

function sendWeather (request, response){
  const jsonWeatherObject = require('./data/weather.json');
  let weatherArr = [];

  jsonWeatherObject.data.forEach(forecast => {
    weatherArr.push(new Weather(forecast));
  })

  response.send(weatherArr);
}

app.get('/location', sendLocation);
app.get('/weather', sendWeather);

// ===== constructor function ===== //

function Location (city, jsonLocationObject){
  this.search_query = city;
  this.formatted_query = jsonLocationObject[0].display_name;
  this.latitude = jsonLocationObject[0].lat;
  this.longitude = jsonLocationObject[0].lon;
}

function Weather (jsonWeatherObject){
  this.forecast = jsonWeatherObject.weather.description;
  this.time = jsonWeatherObject.valid_date;
}

// ===== start the server ===== //

app.listen(PORT, () => console.log(`we are running on PORT : ${PORT}`));
