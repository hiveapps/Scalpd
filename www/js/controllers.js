var scalpd = angular.module('scalpd.controllers', [])

scalpd.controller('ThreadCtrl', function($scope) {});

scalpd.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
});

scalpd.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
});

scalpd.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

scalpd.controller('addController',function($scope,$firebaseArray, $state, postService){
	$scope.submitPost = function(){
		$scope.newPost = postService.all;
		$scope.newPost.$add({
			postTitle: $scope.postTitle,
			postDescription: $scope.postDescription
		});
    $scope.master= null;
    
      $scope.reset = function() {
        $scope.postTitle = angular.copy($scope.master);
        $scope.postDescription = angular.copy($scope.master);
        if ($scope.form) $scope.form.$setPristine();
      };
      $scope.reset();
	};
});