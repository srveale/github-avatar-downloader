var request = require('request');
var fs = require('fs')

console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {

  var GITHUB_USER = "srveale";
  var GITHUB_TOKEN = "9b380e4abffc7bdc5b10debcd0e0484a7c3c2719";

  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var options = {
    url: requestURL,
    headers: {
      'User-Agent': 'srveale'
    }
  }

  request.get(options, cb)

         .on('error', function (err) {
           throw err;
         })

         .on('response', function (response) {
         })

         //.pipe(fs.createWriteStream('./future.html'))

         .on('end', function(){
          console.log('Finished downloading');
         });
  return
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);

  JSON.parse(result.body).forEach(function (user) {
    console.log(user.avatar_url);
  })
});


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

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "./avatars/kvirani.jpg");