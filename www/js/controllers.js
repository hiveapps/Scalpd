var scalpd = angular.module('scalpd.controllers', [])

//Intro Controller used for intro slides
//Within this controller is also the simple login with
// login modal
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
  var isNewUser = true;
  
  users.onAuth(function(authData) {
    if (authData && isNewUser) {
      // save the user's profile into the database so we can list users,
      // use them in Security and Firebase Rules, and show profiles
      users.child("users").child(authData.uid).set({
        provider: authData.provider,
        name: getName(authData)
      });
    }
  });
  
  // find a suitable name based on the meta info given by each provider
  function getName(authData) {
    switch(authData.provider) {
      case 'password':
        return authData.password.email.replace(/@.*/, '');
      case 'twitter':
        return authData.twitter.displayName;
      case 'facebook':
        return authData.facebook.displayName;
    }
  }
});


//This is the thread controller, this is not being used yet
//May be able to remove this but not sure yet.
scalpd.controller('ThreadCtrl', function($scope) {});


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


//Add controller to add posts into firebase
scalpd.controller('addController',function($scope,$firebaseArray, $state, postService){
	$scope.submitPost = function(){
		$scope.newPost = postService.all;
		$scope.newPost.$add({
			postTitle: $scope.postTitle,
			postDescription: $scope.postDescription,
      postDate: $scope.postDate
		});
    
    //This resets the form to master which is null
    //Still need to apply some time of form reset
    //to the "Cancel" button, needs troubleshooting.
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


//Thread controller used to display all posts.
//This could be done better, may need to redo
scalpd.controller('ThreadCtrl',function($scope,postService, PaypalService){
	$scope.posts = postService.all;
  
  $scope.price = 25.00;
  $scope.payPal = function( ) {  
    PaypalService.initPaymentUI().then(function () {
      PaypalService.makePayment($scope.price, "Total").then(...)
    });
   };
});


//Edit Profile Controller this is simply setting the initial
//title to nothing.
scalpd.controller("ClickToEditCtrl", function($scope) {
  $scope.title = "";
});


//Account Controller, this allows the user to toggle their
//push notifications and also registers their logout.
scalpd.controller('AccountCtrl', function($scope, $state, $ionicModal) {
  
  //Push Notification Settings
  $scope.pushNotificationChange = function() {
    console.log('Push Notification Change', $scope.pushNotification.checked);
  };
  
  $scope.pushNotification = { checked: true };
  
  //Logout Functionality !!Need to add in "offAuth" functionality
  //for firebase to unsync the logged session
  $scope.logout = function() {
    $state.go('login');
  };
  
});