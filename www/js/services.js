var scalpr = angular.module('scalpr.services', [])

//Post Service
scalpr.factory('postService', function($firebaseArray) {
	var fb = new Firebase("https://scalpd.firebaseio.com/posts");
	var posts = $firebaseArray(fb);
	var postService= {
		all: posts,
		get: function(postID) {
			return posts.$getRecord(postID);
		}
	};
	return postService;
});