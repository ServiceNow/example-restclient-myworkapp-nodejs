/*
Copyright © 2016 ServiceNow, Inc.
 
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*
 * Initializes the angular module which keeps routers and controllers
 */
var myTasksControllers = angular.module('myTasks.controllers', []);
var myTasks = angular.module('myTasks', ['ngRoute', 'myTasks.controllers']);

// Configure the route provider. For each path route provider determines the 
// controller and view it has to route the path.
myTasks.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'view/login.html',
            controller: 'loginCtrl'
        }).when('/tasks', {
            templateUrl: 'view/task_list.html',
            controller: 'taskListCtrl'
        }).when('/:type/:id', {
            templateUrl: 'view/task_detail.html',
            controller: 'taskDetailCtrl'
        }).otherwise({
        	// by default try to load tasks. if not possible it will redirect to login page.
            redirectTo: '/tasks'
        });
    }
]);

// Filter function to check whether an object is empty
myTasks.filter('isEmpty', function () {
    return function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };
});


