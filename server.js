'use strict'
// -------------------------
// Application Dependencies
// -------------------------
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');

// -------------------------
// Environment variables
// -------------------------
require('dotenv').config();
const HP_API_URL = process.env.HP_API_URL;

// -------------------------
// Application Setup
// -------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));

// Application Middleware override
app.use(methodOverride('_method'));

// Specify a directory for static resources
app.use(express.static('./public'));
app.use(express.static('./img'));

// Database Setup

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

// Set the view engine for server-side templating

app.set('view engine', 'ejs');


// ----------------------
// ------- Routes -------
// ----------------------
app.get('/', showHouses);



// --------------------------------
// ---- Pages Routes functions ----
// --------------------------------
function showHouses(req,res){
    let homeArr = [];
    let url = ('http://hp-api.herokuapp.com/api/characters')
    superagent.get(url).then(data =>{
        data.body.forEach(data =>{
            homeArr.push(new Home(data));

        })
        res.render('index', {result:homeArr});
    })
}



// -----------------------------------
// --- CRUD Pages Routes functions ---
// -----------------------------------


function Home(data){
    this.house = data.house;
    this.image = data.image;
}

// Express Runtime
client.connect().then(() => {
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}).catch(error => console.log(`Could not connect to database\n${error}`));
