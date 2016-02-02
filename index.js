// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var http = require('http');

if (!process.env.DATABASE_URI) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}
var dbPath='mongodb://'+process.env.OPENSHIFT_MONGODB_DB_USERNAME+':'+process.env.OPENSHIFT_MONGODB_DB_PASSWORD+'@'+process.env.OPENSHIFT_MONGODB_DB_HOST+':'+process.env.OPENSHIFT_MONGODB_DB_PORT+'/'+process.env.OPENSHIFT_APP_NAME;
var api = new ParseServer({
  //databaseURI: process.env.DATABASE_URI || 'mongodb://localhost:27017/dev',
  databaseURI:dbPath,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: 'myAppId',
  masterKey: 'myMasterKey'
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a web site.');
});

//var port = process.env.PORT || 1337;
 var port = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var httpServer = http.createServer(app);
httpServer.listen(port, server_ip_address ,function() {
  console.log('parse-server-example running on port ' + port + '.');
});
