var fs = require('fs');
var express = require('express');
require('dotenv').config();
var cors = require('cors');
// var mysql = require('mysql');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'audio/m4a', limit: '60mb' }))
app.use(cors());

function getAllAudio() {
  const allFiles = fs.readdirSync('./');
  const files = [];
 for (const dirent of allFiles) {
    if (dirent.endsWith(".m4a")) {
      let name = dirent.split(".")[0];
      files.push(name);
    }
  }
  return files;
}



app.get('/', function(req, res) {

  const files = getAllAudio();

  let htmlString = "";
  htmlString += "<h1>Recents</h1>"

  for (const name of files) {
    htmlString += "<h3>" + new Date(Number(name)).toLocaleDateString() + " " + new Date(Number(name)).toLocaleTimeString() + "</h3>";
    htmlString += "<p>" +  fs.readFileSync(name + ".txt", 'utf-8') +"</p>"
  }


  res.send(htmlString)
});

app.post('/', function (req, res, next) {
  req.pipe(fs.createWriteStream('./uploadFile.m4a'));
  req.on('end', next);
});

app.post('/addAudio', function (req, res) {

  console.log("Audio is successfully posted!")
  console.log("Obtained audio data: ", req.body);

  const now = (new Date()).getTime();
  fs.writeFile(now + ".m4a", new Buffer(req.body.audioData, "base64"), function(err) {
    console.log(err);
  });

  fs.writeFile(now + ".txt", req.body.transcribedText, 'utf-8', function(err) {
    console.log(err);
  });

})

app.listen(3333, function () { console.log("Server is listening on port 3333!"); });

