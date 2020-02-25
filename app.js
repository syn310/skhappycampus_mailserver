const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '150mb',
    extended: false
}));

require('dotenv').config();
const config = require('./config/environments');
var port = config.mysql.port;

const syncDatabase = require('./bin/sync-database');

app.use('/sendmail', require('./api/interface/mail'));

app.listen(port, () => {
    console.log('mailserver app listening on port : ' + port) ;

    syncDatabase().then(() => {
        console.log('Database sync');
    })
});