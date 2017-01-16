var request = require('request');
var fs = require('fs');


var repoOwner = process.argv[2];
var repoName = process.argv[3];
if (!repoOwner || !repoName) {
  throw "Program requires Owner and Name arguments";
}

console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {

  var GITHUB_USER = "srveale";
  var GITHUB_TOKEN = "9b380e4abffc7bdc5b10debcd0e0484a7c3c2719";

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
           console.log('Finished downloading');
         });
}

function downloadImageByURL(url, filePath) {
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

  JSON.parse(result.body).forEach(function (user) {

    var filePath = './avatars/' + user.login + '.jpg';
    downloadImageByURL(user.avatar_url, filePath);

  });
});




