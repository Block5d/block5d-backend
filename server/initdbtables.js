// get the client
const mysql = require('mysql2');
var jsonfile = require('jsonfile');
var fs = require('fs');
var config = require('./config');

var tablefile = './server/tables.json'

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password1234',
  database: 'employees'
});
console.log(connection);
if(connection){
    // simple query
    connection.query(
    'show tables',
    function(err, results, fields) {
      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available
      var tables = [];
      results.forEach(function(element, idx) {
          console.log(element);
          if(element)
              tables.push(element[`Tables_in_${config.database}`]);
      }, this);
      jsonfile.writeFile(tablefile, tables, function (err) {
          console.error(err)
          if(!err){
              console.log("no error" + fs.existsSync("./tables.json"));
              process.exit();
          }
      });
    }
  );
  
  
}
