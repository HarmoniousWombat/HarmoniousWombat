angular.module('RecallJS')
  .controller('LibraryController', function($window, $scope, Auth, ProblemData, LearningAlgo){


    ProblemData.getAll()
      .then(function(problems){
        $scope.problems = problems;
      });

    ProblemData.getOwn()
      .then(function(problems){
        $scope.dashboardProblems = problems;
      }); 


    $scope.checkDash = function(problem){
      var inDash = false;
      
      $scope.dashboardProblems.forEach(function(dashProb){
        if (problem._id === dashProb._id){
          inDash = true;
        }
      });

      return inDash;
    };


    $scope.addProblem = function(problem){
      ProblemData.addOwn(problem);
      ProblemData.getOwn()
      .then(function(problems){
        $scope.dashboardProblems = problems;
      });
    };

  });