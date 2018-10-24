// require and instantiate express
//require statements -- this adds external modules from node_modules or our own defined modules
const http = require('http');
const path = require('path');
//express related
const Express = require('express');
const bodyParser = require('body-parser');

// csv related
const csv = require("fast-csv");

//file access related
const fs = require('fs-extra');

// mongodb related
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017/';
const dbName = 'CityPopulation';
const collectionName = 'Population';
var CITYPOPULATIONDATA = [];


    var streamm = fs.createReadStream('data/city.csv');

    var csvStream = csv()
      .on("data", function (data) {
        // push data to the objet
        CITYPOPULATIONDATA.push({ City: data[0], Population: data[1], rowid: data[2] }).save;
        
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
          if (err) throw err;
          var dbo = db.db(dbName);
          var myobj = { City: data[0], Population: data[1], rowid: data[2]};
          dbo.collection(collectionName).insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          });
        });        
        
      })
      .on("end", function () {
        console.log("done");
        
      });
    streamm.pipe(csvStream);


//express is the routing engine most commonly used with nodejs
var express = Express();
var server = http.createServer(express);

//tell the express router where to find static files
express.use(Express.static(path.resolve(__dirname, 'views')));

//tell the router to parse urlencoded data and JSON data for us and put it into req.query/req.body
express.use(bodyParser.urlencoded({ extended: true }));
express.use(bodyParser.json());

//set up the HTTP server and start it running
server.listen(process.env.PORT || 3030, process.env.IP || '0.0.0.0', function () {
  var addr = server.address();
  console.log('Server listening at', addr.address + ':' + addr.port);
});



// set the view engine to ejs
express.set('view engine', 'ejs');

// home page
express.get('/', (req, res) => {
  // render `home.ejs` with the list of details
  res.render('home', { CITYPOPULATIONDATA: CITYPOPULATIONDATA });
});

// lowestPopulation
express.post('/lowestPopulaion', (req, res) => {

  // store the list in variable 
  const arrayOfCityPopulation = CITYPOPULATIONDATA;
  
  // The reduce() method applies a function against an accumulator and each element in 
  // the array (from left to right) to reduce it to a single value.
  
  const lowestPopulation = arrayOfCityPopulation.reduce(
    (acc, curr) =>
      acc.Population < curr.Population
        ? acc
        : curr
  )

  res.json(lowestPopulation);
});


//averagePopulaion
express.post('/averagePopulaion', (req, res) => {

  // store the list in variable by city name
  const arrayOfCityPopulation = CITYPOPULATIONDATA;
  
  const averagePopultion = arrayOfCityPopulation.reduce(( acc, curr ) => parseInt(acc) + parseInt(curr.Population),0);
  res.json(averagePopultion);
});


//sortByPopulationDescendingOrder
express.post('/sortByPopulationCity', (req, res) => {

  // store the list in variable by city name
  const arrayOfCityPopulation = CITYPOPULATIONDATA;
  
  const sortedCityData = arrayOfCityPopulation.sort((a, b) => Number(b.Population) - Number(a.Population));
  res.render('home', { CITYPOPULATIONDATA: sortedCityData })
});

//sortByName
express.post('/sortByCity', (req, res) => {

  // store the list in variable by city name
  const arrayOfCityPopulation = CITYPOPULATIONDATA;
  
  var sort_by = function(field, reverse, primer){

    var key = primer ? 
        function(x) {return primer(x[field])} : 
        function(x) {return x[field]};
 
    reverse = !reverse ? 1 : -1;
 
    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
      } 
 }
 
 // Sort by city, case-insensitive, A-Z
 const sortedCityData = arrayOfCityPopulation.sort(sort_by('City', false, (a) => {return a.toUpperCase()}));
  res.render('home', { CITYPOPULATIONDATA: sortedCityData })
});