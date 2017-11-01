const app = require('./app')
var port = process.env.NODE_ENV === 'production' ? process.env.PORT : 4000;

app.listen(port, ()=>{
    logger.info("Server listening on port " + port);
});

