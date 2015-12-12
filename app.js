angular.module('hackerEarthApp', [])
	.filter('spacetodash',function() {
		return function(input) {
			if (input) {
				return input.replace(/\s+/g, '-');    
			}
		}
	})
	
	.directive('starRating', function () {
		return {
		  restrict: 'A',
		  template: '<ul class="rating">' +
			'<li ng-repeat="star in stars" ng-class="star">' +
			'\u2605' +
			'</li>' +
			'</ul>',
		  scope: {
			ratingValue: '=',
			max: '='
		  },
		  link: function (scope, elem, attrs) {
			scope.stars = [];
			for (var i = 0; i < scope.max; i++) {
			  scope.stars.push({
				filled: i < scope.ratingValue
			  });
			}
		  }
		}
	})
		
	.controller('AppCtrl', function($scope,$http,$interval) {
		$scope.apiHits=0;
		$scope.problems=[];
		$scope.ratingFilter ='';
		$scope.likes=[];
		$scope.totalCount=0;
		
		$http.get("http://hackerearth.0x10.info/api/problems?type=json&query=api_hits")
		.then(function(response){
			$scope.apiHits=response.data.api_hits;
		})
		.catch(function(error){
			console.log(error);
		})
		
		$http.get("http://hackerearth.0x10.info/api/problems?type=json&query=list_problems")
		.then(function(response){
			$scope.problems=response.data.problems;
			if(localStorage.getItem("Likes")){
				var like=JSON.parse(localStorage.getItem("Likes"));
				$scope.likes=JSON.parse(localStorage.getItem("Likes"));
				for(i in $scope.problems){
					$scope.problems[i].likes=0;
					$scope.problems[i].likes=like[i];
					if(!$scope.problems[i].likes){
						$scope.problems[i].likes=0;
					}
				}
				$scope.totalCount=$scope.likeCount($scope.problems);
			}
		})
		.catch(function(error){
			console.log(error);
		})
		
		$interval(function(){
			$http.get("http://hackerearth.0x10.info/api/problems?type=json&query=api_hits")
			.then(function(response){
				$scope.apiHits=response.data.api_hits;
			})
			.catch(function(error){
				console.log(error);
			})
		},30000)
		
		$scope.likeProblem=function(index){
			if(!$scope.likes[index]){
				$scope.likes[index]=0;
			}
			$scope.likes[index]=$scope.likes[index]+1;
			localStorage.setItem("Likes",JSON.stringify($scope.likes));
			if(!$scope.problems[index].likes){
				$scope.problems[index].likes=0;
			}
			$scope.problems[index].likes=$scope.likes[index];
			$scope.totalCount=$scope.likeCount($scope.problems);
		}
		$scope.likeCount=function(dataArray){
			var sum=0;
			for(i in dataArray){
				if(dataArray[i].likes){
					sum=sum+dataArray[i].likes;
				}
			}
			return sum;
		}
	})
	;
