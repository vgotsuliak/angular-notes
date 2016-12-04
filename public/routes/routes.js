var module = angular.module('myapp', ['dndLists', 'ngRoute']);

module.config(
    function ($routeProvider) {
        $routeProvider.when('/section/:name', {
            templateUrl: 'routes/viewSection/viewSection.html',
            controller: 'ViewSectionController',
            controllerAs: 'viewSectionController'
        }).when('/register', {
            templateUrl: 'routes/userForm/userForm.html',
            controller: 'UserFormController',
            controllerAs: 'userFormController'
        }).when('/:section?', {
            templateUrl: 'routes/notes/notes.html',
            controller: 'NotesController',
            controllerAs: 'notesController'
        }).otherwise({
            redirectTo: '/'
        });
    }
);