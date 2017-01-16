var request = require('request');

console.log('Welcome to the GitHub Avatar Downloader!');

var requestOptions = {
  host: 'sytantris.github.io',
  path: '/http-examples/step3.html'
};

function getRepoContributors(repoOwner, repoName, cb) {

  var GITHUB_USER = "YOUR USERNAME HERE";
  var GITHUB_TOKEN = "YOUR ACCESSTOKEN HERE";

  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';


  request.get(requestURL)

         .on('error', function (err) {
           throw err;
         })

         .on('response', function (response) {
           console.log(response);
         })

         //.pipe(fs.createWriteStream('./future.html'))

         .on('end', function(){
          console.log('Finished downloading');
         });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});