var scalpd = angular.module('scalpd.controllers', [])

scalpd.controller('ThreadCtrl', function($scope) {});

//Intro Controller
scalpd.controller('AppCtrl', function($scope, $state, $ionicSlideBoxDelegate, $ionicModal) {
 
  // Called to navigate to the main app
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };
  $scope.skip = function() {
    $ionicSlideBoxDelegate.slide(4);
  };
  $scope.restart = function() {
    $ionicSlideBoxDelegate.slide(0);
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
  
  // Called when "Login" button is pressed to open modal
  $ionicModal.fromTemplateUrl('login-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })  

  $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
});

//Totally functioning simple login
scalpd.controller("LoginCtrl", function($scope, $firebaseAuth, $state){
var users = new Firebase("https://scalpd.firebaseio.com/");

  $scope.register = function(username, password){
    users.createUser({
      email    : username,
      password : password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        $state.go('tab.thread');
        $scope.modal.hide();
      }
    });
  }
  $scope.login = function(username, password){
    users.authWithPassword({
      email    : username,
      password : password
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        $state.go('tab.thread');
        $scope.modal.hide();
      }
    });
  }
});

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

//Add controller to add posts into firebase
scalpd.controller('addController',function($scope,$firebaseArray, $state, postService){
	$scope.submitPost = function(){
		$scope.newPost = postService.all;
		$scope.newPost.$add({
			postTitle: $scope.postTitle,
			postDescription: $scope.postDescription,
      postDate: $scope.postDate
		});
    $scope.master= null;
    
      $scope.reset = function() {
        $scope.postTitle = angular.copy($scope.master);
        $scope.postDescription = angular.copy($scope.master);
        $scope.postDate = angular.copy($scope.master);
        if ($scope.form) $scope.form.$setPristine();
      };
      $scope.reset();
	};
});

//Thread controller used to display all posts
scalpd.controller('ThreadCtrl',function($scope,postService){
	$scope.posts = postService.all;
});

//Post controller to add a modal upon button click in thread
scalpd.controller('PostCtrl', function($scope, $ionicModal) {
   
  $ionicModal.fromTemplateUrl('post-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })  

  $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
});