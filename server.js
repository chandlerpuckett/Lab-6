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

app.get('/location', (request,response) => {
  const jsonLocationObject = require('./data/location.json');
  const city = request.query.city;
  const constructedLocation = new Location(city,jsonLocationObject);

  response.send(constructedLocation);
});

app.get('/weather', (request,response) => {
  const jsonWeatherObject = require('./data/weather.json');
  const constructedWeather = new Weather (jsonWeatherObject);

  response.send(constructedWeather);

});


// ===== constructor function ===== //

function Location (city, jsonLocationObject){
  this.search_query = city;
  this.formatted_query = jsonLocationObject[0].display_name;
  this.latitude = jsonLocationObject[0].lat;
  this.longitude = jsonLocationObject[0].lon;
}

function Weather (jsonWeatherObject){
  for (let i of jsonWeatherObject.data){
    this.forecast = jsonWeatherObject.data[i].weather.description;
    this.time = jsonWeatherObject.data[i].valid_Date;
  }
}

// ===== other functions ===== //


// ===== start the server ===== //

app.listen(PORT, () => console.log(`we are running on PORT : ${PORT}`));
