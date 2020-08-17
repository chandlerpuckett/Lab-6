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

app.get('/location', (req,resp) => {

  const jsonLocationObject = require('./data/location.json');
  const constructedLocation = new Location(jsonLocationObject);

  response.send(constructedLocation);
})

// ===== constructor function ===== //

function Location (jsonLocationObject){
  console.log(jsonLocationObject);

  this.name = jsonLocationObject[0].display_name;
  this.lat = jsonLocationObject[0].lat;
  this.lon = jsonLocationObject[0].lon;
}




// ===== start the server ===== //

app.listen(PORT, () => console.log(`we are running on PORT : ${PORT}`));
