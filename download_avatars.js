// Gets all avatars of contributors to a GitHub repository

var request = require('request');
var fs = require('fs');
var dotenv = require('dotenv').config()

if (!fs.existsSync("./.env")) throw "missing .env file"




if (process.argv.length !== 4) {
  throw "Program requires Owner and Name arguments, and these only";
}
var repoOwner = process.argv[2];
var repoName = process.argv[3];


console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {

  var GITHUB_USER = "srveale";
  var GITHUB_TOKEN = process.env.GITHUB_TOKEN.toString();
  if (!GITHUB_TOKEN) throw "Missing Github token";


  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var options = {
    url: requestURL,
    headers: {
      'User-Agent': 'srveale'
    }
  };

  request.get(options, cb)

         .on('error', function (err) {
           throw err;
         })

         .on('end', function(){
           console.log('Response received');
         });
}

function downloadImageByURL(url, filePath) {
  // Downloads image at URL and saves it to given path


  request.get(url)

       .on('error', function (err) {
         throw err;
       })

       .on('response', function (response) {
         console.log('Downloading File');
       })

      .pipe(fs.createWriteStream(filePath));


}

getRepoContributors(repoOwner, repoName, function(err, result) {

  console.log("Errors:", err);

  if (JSON.parse(result.body).message == "Not Found") {
    throw "Repo or Owner not found";
  }


  if (!fs.existsSync("./avatars")){
    fs.mkdirSync("./avatars");
  }

  JSON.parse(result.body).forEach(function (user) {

    var filePath = './avatars/' + user.login + '.jpg';
    downloadImageByURL(user.avatar_url, filePath);
  });
});




