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
  const constructedLocation = new Location(jsonLocationObject);

  console.log(request.query);
  response.send(constructedLocation);
});



// ===== constructor function ===== //

function Location (jsonLocationObject){
  // this.search_query = ;
  this.formatted_query = jsonLocationObject[0].display_name;
  this.latitude = jsonLocationObject[0].lat;
  this.longitude = jsonLocationObject[0].lon;
}


// ===== other functions ===== //




// ===== start the server ===== //

app.listen(PORT, () => console.log(`we are running on PORT : ${PORT}`));
