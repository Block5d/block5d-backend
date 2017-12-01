require('dotenv').config()
const app = require('./app')
const config = require('./config')
var logger = require("./util/logger");
var port = process.env.PORT;
console.log(config);
app.listen(port, ()=>{
    logger.info("Server listening on port " + port);
});

