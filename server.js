// ===== packages ===== //

const express = require('express');
require ('dotenv').config();
const cors = require('cors');

// ===== global variables ===== //

const PORT = process.env.PORT || 3003;
const app = express();
app.use(cors());

// ===== routes ===== //






// ===== start the server ===== //

app.listen(PORT, () => console.log(`we are running on PORT : ${PORT}`));
