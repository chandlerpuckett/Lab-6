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

  if (request.query.city !== 'lynnwood'){
    errorMessage(request,response);
  } else {
    const jsonLocationObject = require('./data/location.json');
    const city = request.query.city;
    const constructedLocation = new Location(city,jsonLocationObject);

    response.send(constructedLocation);
  }

});

app.get('/weather', (request,response) => {

  if (request.query.city !== 'lynwood'){
    errorMessage(request,response);
  } else {
    const jsonWeatherObject = require('./data/weather.json');
    const constructedWeather = new Weather (jsonWeatherObject);

    response.send(constructedWeather);
  }
});




// ===== constructor function ===== //

function Location (city, jsonLocationObject){
  this.search_query = city;
  this.formatted_query = jsonLocationObject[0].display_name;
  this.latitude = jsonLocationObject[0].lat;
  this.longitude = jsonLocationObject[0].lon;
}



function Weather (jsonWeatherObject){
  let weatherArray = [];

  for (let i in jsonWeatherObject.data){
    this.forecast = jsonWeatherObject.data[i].weather.description;
    this.time = jsonWeatherObject.data[i].datetime;

    weatherArray.push(this.forecast, this.time);
  }
  return weatherArray;
}

// ===== other functions ===== //

function errorMessage (request,response) {
  if (request.query.city !== 'lynnwood'){
    return response.status(500).send('try Lynwood!');
  }
}

// ===== start the server ===== //

app.listen(PORT, () => console.log(`we are running on PORT : ${PORT}`));
