// TODO: Change the data model so that a user's problem ratings are mapped
//       to a float

angular.module('RecallJS')
  .factory('LearningAlgo', LearningAlgo);

function LearningAlgo($window) {
  // obtain the problems sent over by the server
  var problems = JSON.parse($window.localStorage.getItem('com.recalljs')).problems;

  // expose methods and properties to rest of app
  var exposed = {
    getProblem: getProblem,
    currProblem: null,
    calculateWeight: calculateWeight,
    getLastAttemptDate: getLastAttemptDate,
    calcAverageRating: calcAverageRating
  };
  return exposed;

  function getProblem() {

    // return null if no new problems available for the user
    if (problems.length === 0) {
      exposed.currProblem = null;
      return null;
    }

    // sample from user's problems based on algorithm
    var samplingDist = createSamplingDist(calculateWeights(problems));
    var rand = Math.random();
    for (var i = 0; i < samplingDist.length; i++) {   // TODO: think about using binary search instead
      var weight = samplingDist[i][0];
      var problem = samplingDist[i][1];
      if (rand <= weight) {
        removeProblem(problem.title); // don't want the user to see this problem in current session
        exposed.currProblem = problem; // allow us to keep track of current problem
        return problem;
      }
    }
    throw new Error("Shouldn't get here since a problem should always be selected");
  }

  function createSamplingDist(weightedProblems) {
    // normalizing weights to sum to 1
    var weights = weightedProblems.map(function(problem){
      return problem[0];
    });

    // create array of tuples [normWeight, problem]
    var tot = sum(weights);
    var normProblems = weightedProblems.map(function(problem){
      var normWeight = problem[0] / tot;
      return [normWeight, problem[1]];
    });

    // sort increasing by normWeight
    var sortedNormProblems = normProblems.sort(function(a,b){
      return a[0] - b[0];
    });

    // create the cumulative distribution function
    var currCum = 0;
    return sortedNormProblems.map(function(problem){
      currCum += problem[0];
      return [currCum, problem[1]];
    });
  }

  function calculateWeights(problems) {
    return problems.map(function(problem){
      // calculate total weight
      var weight = calculateWeight(problem);
      return [weight, problem];
    });
  }

  function calculateWeight(problem) {
    return calcAgeWeight(problem) * calcProgressWeight(problem) *
           calcEffortWeight(problem);
  }

  function calcAgeWeight(problem) {
    // identify number of days since last attempt
    var timeLastAttempt = problem.attempts.slice(-1)[0].timeSubmitted; // assuming last attempt is most recent
    var currTime = (new Date()).getTime(); // in milliseconds
    var daysSince = convertMStoDAYS(currTime - timeLastAttempt);

    // calculate weight
    return Math.pow(2, daysSince/5); // weight will double every five days
  }                                  // since the last attempt

  function calcProgressWeight(problem) {
    // calculate and return weight
    var avgRating = calcAverageRating(problem.attempts, 10); // calculate avg rating of last 10 attempts
    return Math.pow(0.5, 5 * avgRating); // weight will halve every time the
                                         // average rating of past 10 increases by 0.2
  }

  // helper function to calculate the average of the most recent ratings
  function calcAverageRating(attempts, numToAverage) {

    // identify the most recent ratings
    var recentAttempts = attempts.slice(-numToAverage);
    var ratings = recentAttempts.map(function(attempt){
      return attempt.rating;
    });
    // calculate the average of most recent ratings
    var sumRatings = sum(ratings);
    return sumRatings / numToAverage; // NOTE: May be dividing by more than the number of attempts
                               // which is what we want so that we aren't biased against seeing newer problems
  }

  function calcEffortWeight(problem) {
    var mostRecentAttempt = problem.attempts.slice(-1)[0];
    var rating = mostRecentAttempt.rating;
    return rating ? 1 : 10; // if rating is non-zero, return 1, else 10
  }

  function removeProblem(title) {
    for (var i = 0; i < problems.length; i++) {
      var problem = problems[i];
      if (problem.title === title) {
        problems.splice(i, 1);
      }
    }
  }

  // helper function to convert milliseconds to days
  function convertMStoDAYS(numMS) {
    return Math.round(numMS / (1000 * 60 * 60 * 24));
  }

  function sum(numbers) {
    return numbers.reduce(function(tot, curr){
      return tot + curr;
    });
  }

  // TODO: Refactor and place in a utilities or stats Service
  function getLastAttemptDate(problem) {
    var attempts = problem.attempts;
    var timeLastAttempt = attempts[attempts.length-1].timeSubmitted;
    return timeLastAttempt;
  }
}