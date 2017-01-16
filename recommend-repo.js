// Recommendation based off the most common starred repository of contributors

var request = require('request');
var fs = require('fs');
var dotenv = require('dotenv').config()

if (!fs.existsSync("./.env")) throw "missing .env file"

if (process.argv.length !== 4) {
  throw "Program requires Owner and Name arguments, and these only";
}
var repoOwner = process.argv[2];
var repoName = process.argv[3];


function getRepoContributors(repoOwner, repoName, handleContributors) {

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

  request.get(options, handleContributors)

         .on('error', function (err) {
           throw err;
         })

         .on('end', function(){
           console.log('Response received');
         });
}


var handleContributors = function (err, result) {

  console.log("Errors:", err);
  if (JSON.parse(result.body).message == "Not Found") {
    throw "Repo or Owner not found";
  }

  var body = JSON.parse(result.body);

  totalContributors = body.length;
  for (i = 0; i < body.length; i++) {
    var starred_url = body[i].starred_url;
    var starred = getStarred(starred_url);
  }
}

var counts = {};
var contributorCount = 0;

var handleStars = function (err, result) {
  contributorCount += 1;
  console.log('contributor count: ' + contributorCount + "out of" + totalContributors);

  if (result) {

    var body = JSON.parse(result.body);

    for (i = 0; i < body.length; i++){

      if (counts.hasOwnProperty(body[i].full_name)) {

        counts[body[i].full_name] += 1;

      } else {

        counts[body[i].full_name] = 1;

      }
    }

    console.log("Counts updated");
    if (contributorCount == totalContributors) {
    report();
    }
  }
};

function getStarred(starred_url) {

  var GITHUB_USER = "srveale";
  var GITHUB_TOKEN = process.env.GITHUB_TOKEN.toString();
  if (!GITHUB_TOKEN) throw "Missing Github token";

  var options = {
    url: 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@' + starred_url.substring(8, starred_url.length - 15),
    headers: {
      'User-Agent': 'srveale'
    }
  };

  //console.log(options);

  request.get(options, handleStars)

         .on('error', function (err) {
           //throw err;
         })

         .on('response', function (response){
         })

         .on('end', function(){
            console.log('Starred Response received');

         });
}


function report() {

  var sortable = [];
  for (var repo in counts) {
      sortable.push([repo, counts[repo]])
  }

  sortable.sort(function(a, b) {
      return b[1] - a[1];
  })

  for (i = 0; i < 5; i++){
    console.log(sortable[i]);
  }
}

getRepoContributors(repoOwner, repoName, handleContributors);



//setTimeout(report, 8000);

