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
if(connection){
    // simple query
    connection.query(
    'show tables',
    function(err, results, fields) {
      var tables = [];
      for (var x =0; x < results.length; x++){
        if(results[x]){
            var result = results[x];
            tables.push(result[`Tables_in_${config.database}`]);
        }
      }
      
      jsonfile.writeFile(tablefile, tables, function (err) {
          if(!err){
              process.exit();
          }
      });
    }
  );
  
  
}
